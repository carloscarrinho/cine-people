import { Account } from '../../../domain/entities/account'

export interface LoadByAccountRepository {
  loadByEmail: (email: string) => Promise<Account>
}
