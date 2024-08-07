import ProductRepositoryInterface from "../../../domain/product/repository/product-repository-interface";
import { InputDeleteProductDto, OutputDeleteProductDto } from "./delete.product.dto";

export default class DeleteProductUseCase {
  private ProductRepository: ProductRepositoryInterface;
  constructor(ProductRepository: ProductRepositoryInterface) {
    this.ProductRepository = ProductRepository;
  }

  async execute(
    input: InputDeleteProductDto
  ): Promise<OutputDeleteProductDto> {
    const product = await this.ProductRepository.find(input.id);
    
    await this.ProductRepository.delete(input.id);

    return {};
  }
}