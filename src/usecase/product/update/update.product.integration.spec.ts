import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

describe("test integration for product update use case", () => {
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

  it("should update a product", async () => {
    const productRepository = new ProductRepository();

    const product = new Product("1", "Product test", 10);
    await productRepository.create(product);

    const input = {
      id: product.id,
      name: "Product Updated",
      price: 20,
    };

    const usecase = new UpdateProductUseCase(productRepository);

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });

  });

  it("should thrown an error not found", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Product Updated",
      price: 20,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Product not found");
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("1", "Product test", 10);
    await productRepository.create(product);

    const input = {
      id: product.id,
      name: "",
      price: 20,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");
  });
});