import { MongoHelper } from "../../clients/mongo-helper";
import { Account } from "../../../../domain/entities/account";
import { AccountRepository } from "./account-repository";
import { AccountModel } from "../../../../application/usecases/add-account/add-account";
import { LoadByAccountRepository } from "../../../../application/usecases/add-account/load-by-account-repository";
import { UpdateAccessTokenRepository } from "../../../../application/usecases/add-account/update-access-token-repository";
import { ObjectId } from "mongodb";

export class MongoAccountRepository 
  implements AccountRepository, LoadByAccountRepository, UpdateAccessTokenRepository {
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

  async loadByEmail(email: string): Promise<Account> {
    const accountsCollection = await MongoHelper.getCollection("accounts");
    const account = await accountsCollection.findOne({ email });

    if (!account) return null;

    return {
      id: account._id.toString(),
      name: account.name,
      email: account.email,
      password: account.password,
    };
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } }
    )
  }
}
