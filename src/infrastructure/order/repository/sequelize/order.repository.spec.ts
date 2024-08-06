import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    // Act
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
  
    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 10);
    const product2 = new Product("p2", "Product 2", 20);
    const product3 = new Product("p3", "Product 3", 30);
    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);
  
    const orderItem1 = new OrderItem("o1", product1.name, product1.price, product1.id, 1);
    const orderItem2 = new OrderItem("o2", product2.name, product2.price, product2.id, 2);
  
    const order = new Order("order1", "123", [orderItem1, orderItem2]);
  
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
  
    // Arrange
    const orderItem3 = new OrderItem("o3", product3.name, product3.price, product3.id, 3);
    //Adiciona um novo item
    order.addItem(orderItem3);
  
    // Altera a quantidade do item 1
    order.items[0].quantity = 5;
  
    // Remove o item 2
    order.removeItem(orderItem2.id);
  
    await orderRepository.update(order);
  
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
  
    // Assert
    expect(orderModel.toJSON()).toStrictEqual({
      id: "order1",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: 5,
          order_id: "order1",
          product_id: product1.id,
        },
        {
          id: orderItem3.id,
          name: orderItem3.name,
          price: orderItem3.price,
          quantity: orderItem3.quantity,
          order_id: "order1",
          product_id: product3.id,
        },
      ],
    });
  });

  it("should find an order by id", async () => {
    // Act
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    
    const orderItem = new OrderItem("o2", product.name, product.price, product.id, 2);
    const order = new Order("order1", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Arrange
    const orderModel = await OrderModel.findOne({ where: { id: order.id }});
    const foundOrder = await orderRepository.find(order.id);

    // Assert
    expect(foundOrder).toStrictEqual(order);

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: foundOrder.total()
  });

  });

  it("should find all orders", async () => {
    // Act
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("p1", "Product 1", 10);
    const product2 = new Product("p2", "Product 2", 20);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem("o1", product1.name, product1.price, product1.id, 1);
    const orderItem2 = new OrderItem("o2", product2.name, product2.price, product2.id, 2);
    
    const order1 = new Order("order1", "123", [orderItem1]);
    const order2 = new Order("order2", "123", [orderItem2]);
    
    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    // Arrange
    const orders = await orderRepository.findAll();

    // Assert
    expect(orders).toStrictEqual([order1,order2]);
    expect(orders).toHaveLength(2);
  
  });

  it("should throw an error when order not found", async () => {
    // Act
    const orderRepository = new OrderRepository();
    // Assert
    await expect(orderRepository.find("123")).rejects.toThrow("Order not found");
  });

  it("shoulde delete an order", async () => {
    // Act
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("o2", product.name, product.price, product.id, 2);
    const order = new Order("order1", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    // Arrange
    await orderRepository.delete(order.id);

    // Assert
    await expect(orderRepository.find(order.id)).rejects.toThrow("Order not found");
  
  });
});