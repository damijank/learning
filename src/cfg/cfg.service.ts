import { Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class CfgService {
    private readonly getStoreCredentials;
    public conf;
    constructor(private readonly config: ConfigService) {
        this.getStoreCredentials = (location: string = 'US') => {
            const dev = process.env.NODE_ENV !== 'production';
            const prefix = (dev ? 'DEV' : 'PROD') + '_' + location.toUpperCase();
            return {
                storeHash: process.env[`${prefix}_STORE_HASH`],
                storeName: process.env[`${prefix}_STORE_NAME`],
                clientId: process.env[`${prefix}_CLIENT_ID`],
                clientSecret: process.env[`${prefix}_CLIENT_SECRET`],
                accessToken: process.env[`${prefix}_ACCESS_TOKEN`],
            };
        };

        this.conf = {
            credentials: {
                us: this.getStoreCredentials('US'),
                eu: this.getStoreCredentials('UK'), // @TODO: Restore EU lookup here when EU goes live
                ca: this.getStoreCredentials('CA'),
                uk: this.getStoreCredentials('UK'),
                opsUser: process.env.OPS_USERNAME,
                opsPass: process.env.OPS_PASSWORD,
                bpToken: process.env.PROD_BRIGHTPEARL_TOKEN,
                bpAccount: process.env.PROD_BRIGHTPEARL_ACCOUNT,
                bpApp: process.env.PROD_BRIGHTPEARL_APP,
            },
            endpoints: {
                bpRoot: process.env.PROD_BRIGHTPEARL_ROOT,
                bpProduct: '/product-service/product',
                bpProductSearch: '/product-service/product-search',
                blogRoot: process.env.PROD_WP_ROOT,
                opsRoot: process.env.OPS_ROOT,
                root: process.env.STORE_ROOT || 'https://api.bigcommerce.com/stores/',
                storeInformation: 'v2/store',
                products: 'v3/catalog/products',
                categories: 'v3/catalog/categories',
                currencies: 'v2/currencies',
                countries: 'v2/countries',
                gifts: 'v2/gift_certificates',
                cart: 'v3/carts',
                cartItems: 'items',
                checkout: 'v3/checkouts',
                checkoutOrder: 'orders',
                checkoutCoupons: 'coupons',
                checkoutGiftCards: 'gift-certificates',
                checkoutGiftCardsQuery: `?include=${encodeURIComponent(
                    [
                        'cart.lineItems.physicalItems.options',
                        'cart.lineItems.digitalItems.options',
                        'customer',
                        'payments',
                        'promotions.banners',
                    ].join(','),
                )}`,
                checkoutBillingAddress: 'billing-address',
                customer: 'v2/customers',
                customerV3: 'v3/customers',
                customerAddresses: 'addresses',
                customerValidate: 'validate',
                consignment: 'consignments',
                consignmentQuery: '?include=consignments.available_shipping_options',
                coupons: 'v2/coupons',
                order: 'v2/orders',
                orderStatus: 'v2/order_statuses',
                orderTransactionsRoot: 'v3/orders',
                orderTransactions: 'transactions',
                orderCoupons: 'coupons',
                orderShippingAddresses: 'shippingaddresses',
                orderShipments: 'shipments',
                orderProducts: 'products',
                orderTaxes: 'taxes',
                payments: 'v2/payments',
                promotions: 'v3/promotions',
                shipping: 'v2/shipping',
                time: 'v2/time',
                stockRoot: '',
            },
            newsletter: {
                outOfStockListId: process.env.KLAYVIO_OUT_OF_STOCK_LIST_ID,
                newsletterListId: process.env.KLAYVIO_NEWSLETTER_LIST_ID,
                apiKey: process.env.KLAYVIO_API_KEY,
                apiUrl: process.env.KLAYVIO_API_URL,
                endpoints: {
                    subscribe: `${process.env.KLAYVIO_API_URL}${process.env.KLAYVIO_NEWSLETTER_LIST_ID}/subscribe`,
                    notify: `${process.env.KLAYVIO_API_URL}${process.env.KLAYVIO_OUT_OF_STOCK_LIST_ID}/subscribe`,
                },
            },
            whitelistedProps: {
                products: [
                    'calculated_price',
                    'description',
                    'id',
                    'images',
                    'inventory_level',
                    'modifiers',
                    'name',
                    'options',
                    'price',
                    'variants',
                    'custom_fields',
                ],
                store: ['id', 'secure_url', 'country', 'country_code', 'currency', 'currency_symbol'],
            },
            cache: {
                bust: '1 second',
                blog: '1 day',
                hero: '1 hour',
                cart: '1 second',
                customer: '1 second',
                products: '30 minutes',
                store: '7 days',
                shipping: '7 days',
                assets: '5 minutes',
            },
        };
    }

    public all = () => {
        return this.conf;
    };

    public opts = (location = 'US', ops = false) => ({
        baseURL: `${this.conf.endpoints.root}${this.conf.credentials[location.toLowerCase()].storeHash}/`,
            timeout: 30000,
    ...(!ops && {
            headers: {
                /* eslint-disable quote-props */
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'name': this.conf.credentials[location.toLowerCase()].storeName,
                'X-Auth-Client': this.conf.credentials[location.toLowerCase()].clientId,
                'X-Auth-Token': this.conf.credentials[location.toLowerCase()].accessToken,
            },
        }),
    ...(ops && {
            auth: {
                username: this.conf.credentials.opsUser,
                password: this.conf.credentials.opsPass,
            },
        }),

    });

    public error = (error: any, message: string = null): object => {
        const log = false;
        try {
            if (log) {
                if (message) {
                    console.log(message);
                }

                if (error.response) {
                    console.log(error.response.status + ' ' + error.response.statusText);
                    console.log(error.response.data);
                } else {
                    console.log(error);
                }
            }
        } catch (e) {
            if (log) {
                console.log('exception while handling error');
                console.log(e);
            }
        }

        return {};
    };

    public getWpId = (store: string, bcId: number) => {
        if (store === 'ca') {
            switch (bcId) {
                // LARQ Bottle
                case 116: return 835;
                // LARQ Bottle Movement
                case 123: return 860;
                // Limited Edition Sleeve
                case 117: return 861;
                // Perfect Match
                case 122: return 974;
                // Brilliant Pair
                case 126: return 972;
                // Power Couple - regular
                case 124: return 979;
                // Power Couple - movement
                case 125: return 976;
                // Dusk & Dawn
                case 127: return 977;
                // Midnight Rendezvous
                case 121: return 978;
            }
        }

        switch (bcId) {
            // LARQ Bottle
            case 112: return 835;
            // LARQ Bottle Movement
            case 122: return 860;
            // Limited Edition Sleeve
            case 113: return 861;
            // Bottle Cap
            case 120: return 862;
            // USB Cable
            case 119: return 863;
            // Perfect Match
            case 116: return 974;
            // Brilliant Pair
            case 125: return 972;
            // Power Couple - regular
            case 123: return 979;
            // Power Couple - movement
            case 124: return 976;
            // Dusk & Dawn
            case 126: return 977;
            // Midnight Rendezvous
            case 115: return 978;
        }

        // fallback to LARQ Bottle
        return 835;
    };
}
