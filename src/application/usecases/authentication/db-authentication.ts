import {
  Authentication,
  AuthenticationModel
} from './authentication'
import { HashComparer } from '../../contracts/cryptography/hash-comparer';
import { Encrypter } from '../../contracts/cryptography/encrypter'
import { LoadByAccountRepository } from '../add-account/load-by-account-repository'
import { UpdateAccessTokenRepository } from '../add-account/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly repository: LoadByAccountRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepo: UpdateAccessTokenRepository
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string> {
    const account = await this.repository.loadByEmail(credentials.email)
    if (!account) return null

    const isValid = await this.hashComparer.compare(
      credentials.password,
      account.password
    )

    if (!isValid) return null

    const token = await this.encrypter.generate(account.id)

    await this.updateAccessTokenRepo.updateAccessToken(account.id, token)

    return token
  }
}
