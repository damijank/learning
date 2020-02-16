import {HttpService, Injectable} from '@nestjs/common';
import {Command, Console, createSpinner} from 'nestjs-console';
import {CfgService} from '../../cfg/cfg.service';
import {CategoryService} from '../../category/category.service';
import {ColorService} from '../../color/color.service';
import {ProductColorService} from '../../product-color/product-color.service';
import {SizeService} from '../../size/size.service';
import {ProductService} from '../../product/product.service';
import {Product} from '../../product/product.entity';
import {isArrayLike} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {ProductSizeService} from '../../product-size/product-size.service';
import {VariantService} from '../../variant/variant.service';

@Console({
    name: 'product',
    description: 'Get and List Products from database. Get, List and Import products from remotes.',
})
@Injectable()
export class ProductCliService {
      private readonly wpBase = 'https://wp.drinklarq.com/wp-json/wp/v2/products/';

    constructor(
        private readonly http: HttpService,
        private readonly cfg: CfgService,
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

        // const bpAccount = this.cfg.all().credentials.bpAccount;
        // const bpProductSearch = this.cfg.all().endpoints.bpProductSearch;
        // const bpProduct = this.cfg.all().endpoints.bpProduct;
        // const x = await this.http.get(
        //     // `https://ws-use.brightpearl.com/public-api/${bpAccount}${bpProductSearch}?SKU=BDOB074A`,
        //     `https://ws-use.brightpearl.com/public-api/${bpAccount}${bpProduct}/1039?includeOptional=customFields,nullCustomFields`,
        //     // `https://ws-use.brightpearl.com/public-api/${bpAccount}/product-service/product-custom-field/1039`,
        //     // `https://ws-use.brightpearl.com/public-api/${bpAccount}/product-service/product/1039/option-value`,
        //     {
        //         headers: {
        //             /* eslint-disable quote-props */
        //             'brightpearl-account-token': this.cfg.all().credentials.bpToken,
        //             'brightpearl-app-ref': this.cfg.all().credentials.bpApp,
        //             /* eslint-enable quote-props */
        //         },
        //     },
        // ).toPromise()
        //     .then(response => response.data);
        //
        // // console.log(x.response.results);
        // // console.log(x.response);
        // console.log(x);
        //
        // return ;

        store = store.toUpperCase();
        const spin = createSpinner();
        let product: Product;
        let url;

        const a = [1, 2, 3];

        spin.start(`Fetching Product ${id} from ${store} - BigCommerce...`);
        url = this.cfg.all().endpoints.products + '/' + id +
            '?include=variants,custom_fields,options,modifiers';
        const bcProd = await this.bcGet(store, url)
            .then((value) => {
                if (value.data) {
                    spin.succeed(`Fetch Product ${id} from ${store} - BigCommerce done.`);
                } else {
                    spin.fail(`Fetch Product ${id} from ${store} - BigCommerce FAILED.`);
                }
                return value;
            });

        if (!!bcProd.data && !!bcProd.data.id) {
            // console.log(bcProd.data.variants[0]); // return;

            // merge WP data with BC
            const wpId = this.cfg.getWpId(store, bcProd.data.id);
            spin.start(`Fetch Product ${id} from ${store} - WordPress ${wpId} extra info ...`);
            url = this.cfg.all().endpoints.blogRoot + 'products/' + wpId;
            const { acf } = await this.wpGet(url)
                .then(value => {
                    if (value.acf) {
                        spin.succeed(`Fetch Product ${id} from ${store} - WordPress ${wpId} extra info done.`);
                    } else {
                        spin.warn(`Fetch Product ${id} from ${store} - WordPress ${wpId} extra info NOT FOUND, ignoring.`);
                    }
                    return value;
                });
            const updatedVariants = bcProd.data.variants.map(variant => ({
                ...variant,
                ...((acf || {}).variants || []).find(
                    acfVariant => acfVariant.sku === variant.sku,
                ),
            }));
            if (acf && Object.entries(acf).length && acf.description) {
                bcProd.data.description = acf.description;
            }
            bcProd.data.variants = [...updatedVariants];
            // console.log(bcProd.data.variants); // return;

            // product
            product = await this.productService.findOrCreate(store, bcProd.data.id);
            product.name = bcProd.data.name;
            product.type = bcProd.data.type;
            product.description = bcProd.data.description;

            // category
            product.category = null;
            if (isArrayLike(bcProd.data.custom_fields)) {
                for (const index in bcProd.data.custom_fields) {
                    if (bcProd.data.custom_fields.hasOwnProperty(index)) {
                        const customField = bcProd.data.custom_fields[index];
                        // console.log(customField);
                        if (
                            !!customField.id && !!customField.value &&
                            !!customField.name && customField.name.toLowerCase() === 'category'
                        ) {
                            const category = await this.categoryService.findOrCreate(store, customField.id);
                            category.label = customField.value;
                            product.category = category;
                        }
                    }
                }
            }

            // options
            product.colors = [];
            product.sizes = [];
            if (isArrayLike(bcProd.data.options)) {
                for (const index in bcProd.data.options) {
                    if (bcProd.data.options.hasOwnProperty(index)) {
                        const option = bcProd.data.options[index];
                        if (
                            !!option.id && !!option.display_name &&
                            isArrayLike(option.option_values)
                        ) {
                            // colors
                            if (option.display_name.toLowerCase().includes('color')) {
                                for (const colorIndex in option.option_values) {
                                    if (option.option_values.hasOwnProperty(colorIndex)) {
                                        const colorOption = option.option_values[colorIndex];
                                        if (!!colorOption.id && !!colorOption.label) {
                                            const color = await this.colorService.findOrCreate(store, option.id, colorOption.id);
                                            color.label = colorOption.label;
                                            color.value = colorOption.value_data;
                                            const productColor = await this.productColorService.findOrCreate(product, color);
                                            productColor.sortOrder = colorOption.sort_order;
                                            productColor.isDefault = colorOption.is_default;
                                            product.colors.push(productColor);
                                        }
                                    }
                                }
                            } else {
                                // sizes
                                if (option.display_name.toLowerCase().includes('size')) {
                                    for (const sizeIndex in option.option_values) {
                                        if (option.option_values.hasOwnProperty(sizeIndex)) {
                                            const sizeOption = option.option_values[sizeIndex];
                                            if (!!sizeOption.id && !!sizeOption.label) {
                                                const size = await this.sizeService.findOrCreate(store, option.id, sizeOption.id);
                                                size.label = sizeOption.label;
                                                size.value = sizeOption.value_data;
                                                const productSize = await this.productSizeService.findOrCreate(product, size);
                                                productSize.sortOrder = sizeOption.sort_order;
                                                productSize.isDefault = sizeOption.is_default;
                                                product.sizes.push(productSize);
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
            await product.save();

            // variants
            product.variants = [];
            if (isArrayLike(bcProd.data.variants)) {
                for (const index in bcProd.data.variants) {
                    if (bcProd.data.variants.hasOwnProperty(index)) {
                        const bcVariant = bcProd.data.variants[index];
                        if (!!bcVariant.id) {
                            const variant = await this.variantService.findOrCreate(store, bcVariant.id);
                            variant.price = bcVariant.calculated_price;
                            variant.sku = bcVariant.sku;
                            variant.colorValue = bcVariant.mpn;
                            variant.inventoryLevel = bcVariant.inventory_level;
                            variant.isDefault = false;

                            // options
                            variant.color = null;
                            variant.size = null;
                            if (isArrayLike(bcVariant.option_values)) {
                                for (const optionIndex in bcVariant.option_values) {
                                    if (bcVariant.option_values.hasOwnProperty(optionIndex)) {
                                        const option = bcVariant.option_values[optionIndex];
                                        // color
                                        if (option.option_display_name.toLowerCase().includes('color')) {
                                            const color = await this.colorService.findOrCreate(store, option.option_id, option.id);
                                            color.label = option.label;
                                            variant.color = color;
                                        }
                                        // size
                                        if (option.option_display_name.toLowerCase().includes('size')) {
                                            const size = await this.sizeService.findOrCreate(store, option.option_id, option.id);
                                            size.label = option.label;
                                            variant.size = size;
                                        }
                                    }
                                }
                            }

                            // custom OOS message
                            variant.outOfStockMessage = null;
                            if (!!bcVariant.oos && bcVariant.oos.enabled) {
                                variant.outOfStockMessage = bcVariant.oos.message;
                            }

                            // custom POOS message
                            variant.personalizationOutOfStockMessage = null;
                            if (!!bcVariant.poos && bcVariant.poos.enabled) {
                                variant.personalizationOutOfStockMessage = bcVariant.poos.message;
                            }

                            // custom BO message & time
                            variant.backOrderMessage = null;
                            variant.backOrderTime = null;
                            if (!!bcVariant.bo && bcVariant.bo.enabled) {
                                variant.backOrderMessage = bcVariant.bo.message;
                                variant.backOrderTime = bcVariant.bo.time;
                            }

                            // resolve default variant
                            if (
                                !!variant.color && !!variant.size &&
                                !!product.colors.find(productColor =>
                                    productColor.isDefault && (productColor.color.id === variant.color.id)) &&
                                !!product.sizes.find(productSize =>
                                    productSize.isDefault && (productSize.size.id === variant.size.id))
                            ) {
                                variant.isDefault = true;
                            }

                            // personalization stock
                            variant.personalizationInventoryLevel = 0;
                            // @TODO: fetch from BrightPearl
                            //       can't figure out how to determine stock

                            product.variants.push(variant);
                        }
                    }
                }
            }

            // console.log(product); return;
            await product.save();
            return product;
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

    private bcGet = async (store: string, url: string) => {
        try {
            return this.http.get(url, this.cfg.opts(store)).toPromise()
                .then(response => response.data)
                .catch(error => this.cfg.error(error, 'bcGet promise failed'));
        } catch (error) {
            return this.cfg.error(error, 'bcGet failed');
        }
    };

    private wpGet = async (url: string) => {
        try {
            return this.http.get(url).toPromise()
                .then(response => response.data)
                .catch(error => this.cfg.error(error, 'wpGet promise failed'));
        } catch (error) {
            return this.cfg.error(error, 'wpGet failed');
        }
    };
}
