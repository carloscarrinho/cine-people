import request from "supertest";
import { MongoHelper } from "../../../../src/infrastructure/db/clients/mongo-helper";
import app from "../../../../src/main/config/app";
import env from "../../../../src/main/config/env";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrlTest);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
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
