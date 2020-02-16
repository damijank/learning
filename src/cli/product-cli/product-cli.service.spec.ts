import { Test, TestingModule } from '@nestjs/testing';
import { ProductCliService } from './product-cli.service';

describe('ProductsCliService', () => {
  let service: ProductCliService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCliService],
    }).compile();

    service = module.get<ProductCliService>(ProductCliService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
