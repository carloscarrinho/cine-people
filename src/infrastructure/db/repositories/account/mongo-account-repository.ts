import { MongoHelper } from "../../clients/mongo-helper";
import { Account } from "../../../../domain/entities/account";
import { AccountRepository } from "./account-repository";
import { AccountModel } from "../../../../application/usecases/add-account/add-account";

export class MongoAccountRepository implements AccountRepository {
  async store(account: AccountModel): Promise<Account> {
    const accountsCollection = await MongoHelper.getCollection("accounts");
    const { insertedId } = await accountsCollection.insertOne(account);
    return {
      id: insertedId.toString(),
      name: account.name,
      email: account.email,
      password: account.password,
    };
  }
}
