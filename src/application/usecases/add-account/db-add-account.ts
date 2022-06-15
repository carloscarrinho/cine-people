import { Account } from '../../../domain/entities/account'; 
import { AccountRepository } from '../../../infrastructure/db/repositories/account/account-repository';
import { Hasher } from '../../contracts/cryptography/hasher';
import { AddAccount, AccountModel } from './add-account';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher, 
    private readonly addAccountRepository: AccountRepository
  ) {}

  async add(accountData: AccountModel): Promise<Account> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    return await this.addAccountRepository.store({ ...accountData, password: hashedPassword });
  }
}
