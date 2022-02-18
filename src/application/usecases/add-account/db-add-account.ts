import { Account } from "../../../domain/entities/account";
import { Encrypter } from "../../contracts/encrypter";
import { AccountRepository } from "../../../infrastructure/db/repositories/account/account-repository";
import { AccountModel, AddAccount } from "./add-account";

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter, private readonly accountRepository: AccountRepository) {}

  async add(accountData: AccountModel): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);

    const account = await this.accountRepository.store({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
