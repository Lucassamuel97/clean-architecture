import Product from "../../../domain/product/entity/product";
import DeleteProductUseCase from "./delete.product.usecase";

const product = new Product("123", "Product test", 10);

const input = {
  id: product.id,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockImplementation((id: string) => {
      if (id === product.id){
        return Promise.resolve(product);
      }
      return Promise.reject(new Error("Product not found"));
    }),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe("Unit test for product Delete use case", () => {
  it("should Delete a product", async () => {
    const productRepository = MockRepository();
    const productDeleteUseCase = new DeleteProductUseCase(productRepository);

    const output = await productDeleteUseCase.execute(input);

    expect(productRepository.find).toHaveBeenCalledWith(input.id);
    expect(productRepository.delete).toHaveBeenCalledWith(input.id);

    expect(output).toEqual({});
  });

  it("should throw an error if product not found", async () => {
    const productRepository = MockRepository();
    // ID inválido para simular erro
    const invalidInput = { id: "999" }; 
    const productDeleteUseCase = new DeleteProductUseCase(productRepository);

    await expect(productDeleteUseCase.execute(invalidInput)).rejects.toThrow("Product not found");

    // Verifica se o método find foi chamado
    expect(productRepository.find).toHaveBeenCalledWith(invalidInput.id);
    
    // Verifica se o método delete não foi chamado
    expect(productRepository.delete).not.toHaveBeenCalled();
  });

});