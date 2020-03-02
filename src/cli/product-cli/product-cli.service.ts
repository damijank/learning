import {HttpService, Injectable} from '@nestjs/common'
import {Command, Console, createSpinner} from 'nestjs-console'
import {ConfigService} from '../../config'
import {CategoryService} from '../../category/category.service'
import {ColorService} from '../../color/color.service'
import {ProductColorService} from '../../product-color/product-color.service'
import {SizeService} from '../../size/size.service'
import {ProductService} from '../../product/product.service'
import {Product} from '../../product/product.entity'
import {isArrayLike, isObject} from 'rxjs/internal-compatibility'
import {map} from 'rxjs/operators'
import {ProductSizeService} from '../../product-size/product-size.service'
import {VariantService} from '../../variant/variant.service'

@Console({
    name: 'product',
    description: 'Get and List Products from database. Get, List and Import products from remotes.',
})
@Injectable()
export class ProductCliService {
    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService,
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
        private readonly colorService: ColorService,
        private readonly productColorService: ProductColorService,
        private readonly sizeService: SizeService,
        private readonly productSizeService: ProductSizeService,
        private readonly variantService: VariantService,
    ) {}

    @Command({
        command: 'get-remote <store> <id>',
        description: 'Get Product from remotes.',
    })
    async getRemoteProduct(store: string, id: number): Promise<Product> {
        const credentials = await this.configService.createRemoteCredentials(store)
        const endpoints = await this.configService.createEndpoints(store)

        store = store.toUpperCase()
        const spin = createSpinner()
        let product: Product
        let url: string

        // get BC data
        spin.start(`Fetching Product ${id} from ${store} - BigCommerce...`)
        url = `${endpoints.products}/${id}?include=variants,custom_fields,options,modifiers`
        const bcProd = await this.bcGet(credentials, endpoints, url)
            .then((value) => {
                if (value.data) {
                    spin.succeed(`Fetch Product ${id} from ${store} - BigCommerce done.`)
                } else {
                    spin.fail(`Fetch Product ${id} from ${store} - BigCommerce FAILED.`)
                }
                return value
            })

        if (!!bcProd.data && !!bcProd.data.id) {
            // console.log(bcProd.data.variants[0])

            // merge WP with BC
            const wpId = this.getWpId(store, bcProd.data.id)
            spin.start(`Fetch Product ${id} from ${store} - WordPress ${wpId} extra info...`)
            url = `${endpoints.wpRoot}products/${wpId}`
            const { acf } = await this.wpGet(url)
                .then(value => {
                    if (value.acf) {
                        spin.succeed(`Fetch Product ${id} from ${store} - WordPress ${wpId} extra info done.`)
                    } else {
                        spin.warn(`Fetch Product ${id} from ${store} - WordPress ${wpId} extra info NOT FOUND, ignoring.`)
                    }
                    return value
                })
            const updatedVariants = bcProd.data.variants.map(variant => ({
                ...variant,
                ...((acf || {}).variants || []).find(
                    acfVariant => acfVariant.sku === variant.sku,
                ),
            }))
            if (acf && Object.entries(acf).length && acf.description) {
                bcProd.data.description = acf.description
            }
            bcProd.data.variants = [...updatedVariants]
            // console.log(bcProd.data.variants)

            // product
            product = await this.productService.findOrCreate(store, bcProd.data.id)
            product.name = bcProd.data.name
            product.type = bcProd.data.type
            product.description = bcProd.data.description

            // category
            product.category = null
            if (isArrayLike(bcProd.data.custom_fields)) {
                for (const index in bcProd.data.custom_fields) {
                    if (bcProd.data.custom_fields.hasOwnProperty(index)) {
                        const customField = bcProd.data.custom_fields[index]
                        // console.log(customField)
                        if (
                            !!customField.id && !!customField.value &&
                            !!customField.name && customField.name.toLowerCase() === 'category'
                        ) {
                            const category = await this.categoryService.findOrCreate(store, customField.id)
                            category.label = customField.value
                            product.category = category
                        }
                    }
                }
            }

            // options
            product.colors = []
            product.sizes = []
            if (isArrayLike(bcProd.data.options)) {
                for (const index in bcProd.data.options) {
                    if (bcProd.data.options.hasOwnProperty(index)) {
                        const option = bcProd.data.options[index]
                        if (
                            !!option.id && !!option.display_name &&
                            isArrayLike(option.option_values)
                        ) {
                            // colors
                            if (option.display_name.toLowerCase().includes('color')) {
                                for (const colorIndex in option.option_values) {
                                    if (option.option_values.hasOwnProperty(colorIndex)) {
                                        const colorOption = option.option_values[colorIndex]
                                        if (!!colorOption.id && !!colorOption.label) {
                                            const color = await this.colorService.findOrCreate(store, option.id, colorOption.id)
                                            color.label = colorOption.label
                                            color.value = colorOption.value_data
                                            const productColor = await this.productColorService.findOrCreate(product, color)
                                            productColor.sortOrder = colorOption.sort_order
                                            productColor.isDefault = colorOption.is_default
                                            product.colors.push(productColor)
                                        }
                                    }
                                }
                            } else {
                                // sizes
                                if (option.display_name.toLowerCase().includes('size')) {
                                    for (const sizeIndex in option.option_values) {
                                        if (option.option_values.hasOwnProperty(sizeIndex)) {
                                            const sizeOption = option.option_values[sizeIndex]
                                            if (!!sizeOption.id && !!sizeOption.label) {
                                                const size = await this.sizeService.findOrCreate(store, option.id, sizeOption.id)
                                                size.label = sizeOption.label
                                                size.value = sizeOption.value_data
                                                const productSize = await this.productSizeService.findOrCreate(product, size)
                                                productSize.sortOrder = sizeOption.sort_order
                                                productSize.isDefault = sizeOption.is_default
                                                product.sizes.push(productSize)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // persist product with colors and sizes (so variants can resolve them)
            await product.save()

            // variants
            product.variants = []
            if (isArrayLike(bcProd.data.variants)) {
                for (const index in bcProd.data.variants) {
                    if (bcProd.data.variants.hasOwnProperty(index)) {
                        const bcVariant = bcProd.data.variants[index]
                        if (!!bcVariant.id) {
                            const variant = await this.variantService.findOrCreate(store, bcVariant.id)
                            variant.price = bcVariant.calculated_price
                            variant.sku = bcVariant.sku
                            variant.colorValue = bcVariant.mpn
                            variant.inventoryLevel = bcVariant.inventory_level
                            variant.isDefault = false

                            // options
                            variant.color = null
                            variant.size = null
                            if (isArrayLike(bcVariant.option_values)) {
                                for (const optionIndex in bcVariant.option_values) {
                                    if (bcVariant.option_values.hasOwnProperty(optionIndex)) {
                                        const option = bcVariant.option_values[optionIndex]
                                        // color
                                        if (option.option_display_name.toLowerCase().includes('color')) {
                                            const color = await this.colorService.findOrCreate(store, option.option_id, option.id)
                                            color.label = option.label
                                            variant.color = color
                                        }
                                        // size
                                        if (option.option_display_name.toLowerCase().includes('size')) {
                                            const size = await this.sizeService.findOrCreate(store, option.option_id, option.id)
                                            size.label = option.label
                                            variant.size = size
                                        }
                                    }
                                }
                            }

                            // custom OOS message
                            variant.outOfStockMessage = null
                            if (!!bcVariant.oos && bcVariant.oos.enabled) {
                                variant.outOfStockMessage = bcVariant.oos.message
                            }

                            // custom POOS message
                            variant.personalizationOutOfStockMessage = null
                            if (!!bcVariant.poos && bcVariant.poos.enabled) {
                                variant.personalizationOutOfStockMessage = bcVariant.poos.message
                            }

                            // custom POOS threshold
                            variant.personalizationOutOfStockThreshold = 0
                            if (!!bcVariant.poos) {
                                variant.personalizationOutOfStockThreshold =
                                    parseInt(bcVariant.poos.threshold,10) ? parseInt(bcVariant.poos.threshold, 10) : 0
                            }

                            // custom BO message & time
                            variant.backOrderMessage = null
                            variant.backOrderTime = null
                            if (!!bcVariant.bo && bcVariant.bo.enabled) {
                                variant.backOrderMessage = bcVariant.bo.message
                                variant.backOrderTime = bcVariant.bo.time
                            }

                            // resolve default variant
                            if (
                                !!variant.color && !!variant.size &&
                                !!product.colors.find(productColor =>
                                    productColor.isDefault && (productColor.color.id === variant.color.id)) &&
                                !!product.sizes.find(productSize =>
                                    productSize.isDefault && (productSize.size.id === variant.size.id))
                            ) {
                                variant.isDefault = true
                            }

                            // personalization stock
                            variant.personalizationEnabled = false
                            variant.personalizationInventoryLevel = 0

                            spin.start(`Fetching Product ${id} from ${store} - BrightPearl ${variant.sku}  product...`)
                            url = `${endpoints.bpRoot}${credentials.bpAccount}/${endpoints.bpProductSearch}/?SKU=${variant.sku}` // BDOB074A
                            const bpProdId = await this.bpGet(credentials, url)
                                .then((value) => {
                                    if (isObject(value.response) && isArrayLike(value.response.results) && isArrayLike(value.response.results[0])) {
                                        value = String(value.response.results[0][0])
                                        if (value.length > 0) {
                                            spin.succeed(`Fetch Product ${id} from ${store} - BrightPearl ${variant.sku} product done.`)
                                            return value
                                        }
                                    }
                                    spin.fail(`Fetch Product ${id} from ${store} - BrightPearl ${variant.sku} product NOT FOUND, ignoring.`)
                                    return null
                                })
                            if (bpProdId.length !== null) {
                                spin.start(`Fetching Product ${id} from ${store} - BrightPearl ${variant.sku}  personalization stock...`)
                                url = `${endpoints.bpRoot}${credentials.bpAccount}/${endpoints.bpProductAvailability}/${bpProdId}` // 1039
                                const bpWarehouse = await this.bpGet(credentials, url)
                                    .then((value) => {
                                        if (
                                            isObject(value.response) && isObject(value.response[bpProdId]) &&
                                            isObject(value.response[bpProdId].warehouses) &&
                                            !!(value.response[bpProdId].warehouses[endpoints.bpWarehouse])
                                        ) {
                                            spin.succeed(`Fetch Product ${id} from ${store} - BrightPearl ${variant.sku} personalization stock done.`)
                                            return value.response[bpProdId].warehouses[endpoints.bpWarehouse]
                                        }
                                        spin.fail(`Fetch Product ${id} from ${store} - BrightPearl ${variant.sku} personalization stock NOT FOUND, ignoring.`)
                                        return null
                                    })
                                if (bpWarehouse !== null) {
                                    variant.personalizationEnabled = true
                                    variant.personalizationInventoryLevel = parseInt(bpWarehouse.inStock, 10) ? parseInt(bpWarehouse.inStock, 10) : 0
                                }
                            }

                            product.variants.push(variant)
                        }
                    }
                }
            }

            // console.log(product.variants); return
            await product.save()
            return product
        }
    }

    // @Command({
    //     command: 'get <id>',
    //     description: 'Get Product from database.',
    // })
    // async getProduct(id: number): Promise<Product> {
    //     const spin = createSpinner()
    //         .start(`Fetching Product ${id} from database...`);
    //     const res = await this.repo.findOne(id, { loadEagerRelations: true });
    //     spin.succeed(`Fetch Product ${id} from database done.`);
    //
    //     // console.log(res);
    //     return res;
    // }
    //
    // @Command({
    //     command: 'list',
    //     description: 'List Products from database.',
    // })
    // async listProducts(): Promise<Product[]> {
    //     const spin = createSpinner()
    //         .start(`Fetching Products from database...`);
    //     const res = await this.repo.find({ loadEagerRelations: false });
    //     spin.succeed(`Fetch Products from database done.`);
    //
    //     // console.log(res);
    //     return res;
    // }
    //
    // @Command({
    //     command: 'list-remote',
    //     description: 'List Products from remotes.',
    // })
    // async listRemoteProducts(entity: string, productId: string, productPart: string): Promise<void> {
    //     const spin = createSpinner();
    //     const bcBase = 'https://api.livelarq.com/api/us';
    //     let uri = '/' + entity;
    //     if (!!productId) {
    //         uri = uri + '/' + productId;
    //         if (!!productPart) {
    //             uri = uri + '/' + productPart;
    //         }
    //     }
    //
    //     const url = bcBase + uri;
    //     spin.start(`Listing ${url}`);
    //     const res = await this.http.get(url).pipe(map(r => r.data)).toPromise();
    //     // const res = await this.http.get(url).toPromise();
    //     console.log(res);
    //
    //     if (entity === 'products' && !!productId && !productPart) {
    //         let product = await this.repo.findOne(res.id);
    //         if (!!product) {
    //             product = await this.repo.create();
    //         }
    //         // const product = new Product();
    //         product.id = res.data.id;
    //         product.name = res.data.name + ' YAY';
    //         product.description = res.data.description;
    //         console.log(product);
    //
    //         const color = new Color();
    //         color.label = 'BLA';
    //         color.value = '#121212';
    //         product.colors = [color];
    //
    //         await product.save();
    //
    //     }
    //
    //     spin.succeed(`Listing done ${url}`);
    //
    //     // send the response to the cli
    //     // process.stdout.write(JSON.stringify(res));
    //     // console.log(res);
    // }

    // BigCommerce
    private bcGet = async (credentials, endpoints, url: string) => {
        try {
            return this.http.get(url, this.bcOpts(credentials, endpoints)).toPromise()
                .then(response => response.data)
                .catch(error => this.error(error, 'bcGet promise failed'))
        } catch (error) {
            return this.error(error, 'bcGet failed')
        }
    }

    // BrightPearl
    private bpGet = async (credentials, url: string) => {

        try {
            return this.http.get(
                url,
                {
                    headers: {
                        /* eslint-disable quote-props */
                        'brightpearl-account-token': credentials.bpToken,
                        'brightpearl-app-ref': credentials.bpApp,
                        /* eslint-enable quote-props */
                    },
                },
            ).toPromise()
                .then(response => response.data)
                .catch(error => this.error(error, 'bpGet promise failed'))
        } catch (error) {
            return this.error(error, 'bpGet failed')
        }
    }

    // WordPress
    private wpGet = async (url: string) => {
        try {
            return this.http.get(url).toPromise()
                .then(response => response.data)
                .catch(error => this.error(error, 'wpGet promise failed'))
        } catch (error) {
            return this.error(error, 'wpGet failed')
        }
    }

    private bcOpts = (credentials, endpoints) => {
        return {
            baseURL: `${endpoints.bcRoot}${credentials.bcStoreHash}/`,
            timeout: 30000,
            headers: {
                /* eslint-disable quote-props */
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'name': credentials.bcStoreName,
                'X-Auth-Client': credentials.bcClientId,
                'X-Auth-Token': credentials.bcAccessToken,
                /* eslint-enable quote-props */
            },
        }
    }

    private error = (error: any, message: string = null): object => {
        // @TODO: Inject logger
        const log = false
        try {
            if (log) {
                if (message) {
                    console.log(message)
                }

                if (error.response) {
                    console.log(error.response.status + ' ' + error.response.statusText)
                    console.log(error.response.data)
                } else {
                    console.log(error)
                }
            }
        } catch (e) {
            if (log) {
                console.log('exception while handling error')
                console.log(e)
            }
        }

        return {}
    }

    private getWpId = (store: string, bcId: number) => {
        if (store === 'ca') {
            switch (bcId) {
                // LARQ Bottle
                case 116: return 835
                // LARQ Bottle Movement
                case 123: return 860
                // Limited Edition Sleeve
                case 117: return 861
                // Perfect Match
                case 122: return 974
                // Brilliant Pair
                case 126: return 972
                // Power Couple - regular
                case 124: return 979
                // Power Couple - movement
                case 125: return 976
                // Dusk & Dawn
                case 127: return 977
                // Midnight Rendezvous
                case 121: return 978
            }
        }

        switch (bcId) {
            // LARQ Bottle
            case 112: return 835
            // LARQ Bottle Movement
            case 122: return 860
            // Limited Edition Sleeve
            case 113: return 861
            // Bottle Cap
            case 120: return 862
            // USB Cable
            case 119: return 863
            // Perfect Match
            case 116: return 974
            // Brilliant Pair
            case 125: return 972
            // Power Couple - regular
            case 123: return 979
            // Power Couple - movement
            case 124: return 976
            // Dusk & Dawn
            case 126: return 977
            // Midnight Rendezvous
            case 115: return 978
        }

        // fallback to LARQ Bottle
        return 835
    }
}
