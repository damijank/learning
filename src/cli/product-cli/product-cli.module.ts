import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Product} from '../../product/product.entity';
import {Category} from '../../category/category.entity';
import {Color} from '../../color/color.entity';
import {ProductColor} from '../../product-color/product-color.entity';
import {Size} from '../../size/size.entity';
import {CategoryModule} from '../../category/category.module';
import {ColorModule} from '../../color/color.module';
import {ProductColorModule} from '../../product-color/product-color.module';
import {SizeModule} from '../../size/size.module';
import {CfgService} from '../../cfg/cfg.service';
import {ConfigService} from '@nestjs/config';
import {ProductService} from '../../product/product.service';
import {CategoryService} from '../../category/category.service';
import {ColorService} from '../../color/color.service';
import {ProductColorService} from '../../product-color/product-color.service';
import {SizeService} from '../../size/size.service';
import {ProductModule} from '../../product/product.module';
import {ProductCliService} from './product-cli.service';
import {ProductSizeService} from '../../product-size/product-size.service';
import {ProductSizeModule} from '../../product-size/product-size.module';
import {ProductSize} from '../../product-size/product-size.entity';
import {Variant} from '../../variant/variant.entity';
import {VariantService} from '../../variant/variant.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        TypeOrmModule.forFeature([Category]),
        TypeOrmModule.forFeature([Color]),
        TypeOrmModule.forFeature([ProductColor]),
        TypeOrmModule.forFeature([Size]),
        TypeOrmModule.forFeature([ProductSize]),
        TypeOrmModule.forFeature([Variant]),
        HttpModule,
        ProductModule,
        CategoryModule,
        ColorModule,
        ProductColorModule,
        SizeModule,
        ProductSizeModule,
    ],
    providers: [
        ProductCliService,
        CfgService,
        ConfigService,
        ProductService,
        CategoryService,
        ColorService,
        ProductColorService,
        SizeService,
        ProductSizeService,
        VariantService,
    ],
    controllers: [
    ],
    exports: [
    ],
})
export class ProductCliModule {}
