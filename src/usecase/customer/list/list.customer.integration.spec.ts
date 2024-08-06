import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Address from "../../../domain/customer/value-object/address";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import ListCustomerUseCase from "./list.customer.usecase";

describe("integration test for listing customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list a customer", async () => {
    const customerRepository = new CustomerRepository();
    
    const customer1 = CustomerFactory.createWithAddress(
      "John Doe",
      new Address("Street 1", 1, "12345", "City")
    );

    const customer2 = CustomerFactory.createWithAddress(
      "Jane Doe",
      new Address("Street 2", 2, "123456", "City 2")
    );

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    const useCase = new ListCustomerUseCase(customerRepository);

    const output = await useCase.execute({});
    
    expect(output.customers.length).toBe(2);
    expect(output.customers[0].id).toBe(customer1.id);
    expect(output.customers[0].name).toBe(customer1.name);
    expect(output.customers[0].address.street).toBe(customer1.Address.street);
    expect(output.customers[1].id).toBe(customer2.id);
    expect(output.customers[1].name).toBe(customer2.name);
    expect(output.customers[1].address.street).toBe(customer2.Address.street);
  });

  it("should list a customer with empty list", async () => {
    const customerRepository = new CustomerRepository();
    const useCase = new ListCustomerUseCase(customerRepository);

    const output = await useCase.execute({});
    
    expect(output.customers.length).toBe(0);
  });

});