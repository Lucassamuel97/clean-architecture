import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import DeleteProductUseCase from "./delete.product.usecase";

describe("Integration test for product Delete use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should delete a product", async () => {
    const productRepository = new ProductRepository();

    const product = new Product("1", "Product test", 10);
    await productRepository.create(product);

    const input = {
      id: product.id
    };

    const usecase = new DeleteProductUseCase(productRepository);

    await usecase.execute(input);

    await expect(productRepository.find(input.id)).rejects.toThrow("Product not found");
  });

  it("should throw an error if product not found", async () => {
    const productRepository = new ProductRepository();

    const invalidInput = { id: "999" };

    const usecase = new DeleteProductUseCase(productRepository);

    await expect(usecase.execute(invalidInput)).rejects.toThrow("Product not found");
  });
});
