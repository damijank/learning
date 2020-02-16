import { Test, TestingModule } from '@nestjs/testing';
import { ProductColorController } from './product-color.controller';

describe('ProductColor Controller', () => {
  let controller: ProductColorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductColorController],
    }).compile();

    controller = module.get<ProductColorController>(ProductColorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
