import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("samuca");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.number).toBe(123);
    expect(response.body.address.zip).toBe("12345");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "Samuca",
    });
    expect(response.status).toBe(500);
  });

  it("should update a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);

    const updateResponse = await request(app)
      .put("/customer/" + response.body.id)
      .send({
        id: response.body.id,
        name: "Samuca Update",
        address: {
          street: "Street Update",
          city: "City 2",
          number: 1234,
          zip: "12344",
        },
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe("Samuca Update");
    expect(updateResponse.body.address.street).toBe("Street Update");
  });

  it("should not update a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);

    const updateResponse = await request(app)
      .put("/customer/" + response.body.id)
      .send({
        name: "Samuca Update",
      });
    expect(updateResponse.status).toBe(500);

  });

  it("should find a customer by id", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);

    const findResponse = await request(app)
      .get("/customer/" + response.body.id)
      .send();
    expect(findResponse.status).toBe(200);
    expect(findResponse.body.name).toBe("Samuca");
    expect(findResponse.body.address.street).toBe("Street");
  });


  it("should not find a customer by id", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);

    const findResponse = await request(app)
      .get("/customer/" + "123")
      .send();
    expect(findResponse.status).toBe(500);
  });

  it("should list all customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 1234,
          zip: "12344",
        },
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers.length).toBe(2);
    const customer = listResponse.body.customers[0];
    expect(customer.name).toBe("Samuca");
    expect(customer.address.street).toBe("Street");
    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Jane");
    expect(customer2.address.street).toBe("Street 2");
  });

  it("should list all xml customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Samuca",
        address: {
          street: "Street",
          city: "City",
          number: 123,
          zip: "12345",
        },
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Jane",
        address: {
          street: "Street 2",
          city: "City 2",
          number: 1234,
          zip: "12344",
        },
      });
    expect(response2.status).toBe(200);

    const listResponseXML = await request(app).get("/customer/")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<customers>`);
    expect(listResponseXML.text).toContain(`<customer>`);
    expect(listResponseXML.text).toContain(`<name>Samuca</name>`);
    expect(listResponseXML.text).toContain(`<address>`);
    expect(listResponseXML.text).toContain(`<street>Street</street>`);
    expect(listResponseXML.text).toContain(`<city>City</city>`);
    expect(listResponseXML.text).toContain(`<number>123</number>`);
    expect(listResponseXML.text).toContain(`<zip>12345</zip>`);
    expect(listResponseXML.text).toContain(`</address>`);
    expect(listResponseXML.text).toContain(`</customer>`);
    expect(listResponseXML.text).toContain(`<name>Jane</name>`);
    expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
    expect(listResponseXML.text).toContain(`</customers>`);
    
  });
});