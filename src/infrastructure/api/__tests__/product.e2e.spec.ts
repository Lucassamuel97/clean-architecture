import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product A",
        price: 40,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product A");
    expect(response.body.price).toBe(40);
  });

  it("should not create a product with invalid data", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product A",
      });

    expect(response.status).toBe(500);
  });

  it("should update a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product",
        price: 40,
      });
    expect(response.status).toBe(200);

    const updateResponse = await request(app)
      .put("/product/" + response.body.id)
      .send({
        id: response.body.id,
        name: "Product Update",
        price: 50,
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe("Product Update");
    expect(updateResponse.body.price).toBe(50);
  });

  it("should not update a product with invalid data", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product",
        price: 40,
      });
    expect(response.status).toBe(200);

    const updateResponse = await request(app)
      .put("/product/" + response.body.id)
      .send({
        name: "",
        price: 50,
      });
    expect(updateResponse.status).toBe(500);
  });

  it("should find a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product",
        price: 40,
      });
    expect(response.status).toBe(200);

    const findResponse = await request(app).get("/product/" + response.body.id);
    expect(findResponse.status).toBe(200);
    expect(findResponse.body.name).toBe("Product");
    expect(findResponse.body.price).toBe(40);
  });

  it("should not find a product with invalid id", async () => {
    const response = await request(app)
      .get("/product/1");
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product A",
        price: 40,
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Product B",
        price: 20,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(40);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Product B");
    expect(product2.price).toBe(20);
    
  });

  it("should delete a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product",
        price: 40,
      });
    expect(response.status).toBe(200);

    const deleteResponse = await request(app)
      .delete("/product/" + response.body.id);
    expect(deleteResponse.status).toBe(200);
  });

  it("should not delete a product with invalid id", async () => {
    const response = await request(app)
      .delete("/product/1");
    expect(response.status).toBe(500);
  });

});