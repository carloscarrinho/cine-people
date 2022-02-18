import { Account } from "../../../domain/entities/account";

export interface AccountModel {
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add: (account: AccountModel) => Promise<Account>;
}