import { Collection } from "mongodb";
import env from "../../../../../../src/main/config/env";
import { MongoHelper } from "../../../../../../src/infrastructure/db/clients/mongo-helper";
import { LogMongoRepository } from "../../../../../../src/infrastructure/db/repositories/log/log-repository";

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository();
};

describe("Log Mongo Repository ", () => {
  let errorsCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection("errors");
    await errorsCollection.deleteMany({});
  });

  it("Should create an error log on database on success", async () => {
    // Given
    const sut = makeSut();

    // When
    await sut.log("any_error");

    // Then
    const errors = await errorsCollection.countDocuments();
    expect(errors).toBe(1);
  });
});
