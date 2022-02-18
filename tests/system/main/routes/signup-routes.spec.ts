import request from "supertest";
import { MongoHelper } from "../../../../src/infrastructure/db/clients/mongo-helper";
import { RabbitMQHelper } from "../../../../src/infrastructure/message-broker/clients/rabbitmq-helper";
import app from "../../../../src/main/config/app";
import env from "../../../../src/main/config/env";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest);
    await RabbitMQHelper.connect(env.rabbitMQ);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    await RabbitMQHelper.disconnect();
  });

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection("accounts");
    await accountsCollection.deleteMany({});
  });

  it("Should return an account on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Carlos",
        email: "carlos@mail.com",
        password: "12345",
        passwordConfirmation: "12345",
      })
      .expect(200);
  });
});
