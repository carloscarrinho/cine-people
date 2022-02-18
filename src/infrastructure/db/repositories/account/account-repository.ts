import { AccountModel } from "../../../../application/usecases/add-account/add-account";
import { Account } from "../../../../domain/entities/account";

export interface AccountRepository {
  store(account: AccountModel): Promise<Account>;
}
