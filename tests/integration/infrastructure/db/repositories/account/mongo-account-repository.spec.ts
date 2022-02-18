import { MongoHelper } from "../../../../../../src/infrastructure/db/clients/mongo-helper";
import { MongoAccountRepository } from "../../../../../../src/infrastructure/db/repositories/account/mongo-account-repository";
import env from "../../../../../../src/main/config/env";

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository();
};

describe("Integration", () => {
  describe("Infrastructure", () => {
    describe("DB", () => {
      describe("Repositories: MongoAccountRepository", () => {
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
          // Given
          const sut = makeSut();
          const accountData = {
            name: "any_name",
            email: "any_email@mail.com",
            password: "hashed_password",
          };

          // When
          const account = await sut.store(accountData);

          // Then
          expect(account).toBeTruthy();
          expect(account.id).toBeTruthy();
          expect(account.name).toStrictEqual(accountData.name);
          expect(account.email).toStrictEqual(accountData.email);
          expect(account.password).toStrictEqual(accountData.password);
        });
      });
    });
  });
});
