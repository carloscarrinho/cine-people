import { Request, Response } from 'express'
import env from '../../config/env'
import { DbAuthentication } from '../../../application/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infrastructure/cryptography/bcrypt-adapter' 
import { JwtAdapter } from '../../../infrastructure/cryptography/jwt-adapter'
import { MongoAccountRepository } from '../../../infrastructure/db/repositories/account/mongo-account-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller' 
import { Controller } from '../../../presentation/protocols/controller' 
import { HttpRequest } from '../../../presentation/protocols/http-request'
import { HttpResponse } from '../../../presentation/protocols/http-response'
import { LogMongoRepository } from '../../../infrastructure/db/repositories/log/log-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

const makeLoginController = (): Controller => {
  const accountMongoRepo = new MongoAccountRepository()
  const hasherComparer = new BcryptAdapter(12)
  const encrypter = new JwtAdapter(env.secret)
  const dbAuthentication = new DbAuthentication(accountMongoRepo, hasherComparer, encrypter, accountMongoRepo)

  const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(loginController, logMongoRepository)
}

export const adaptLoginController = async (req: Request, res: Response): Promise<Response> => {
  const controller = makeLoginController()
  const httpRequest: HttpRequest = { body: req.body }
  const httpResponse: HttpResponse = await controller.handle(httpRequest)

  if (httpResponse.statusCode !== 200) {
    return res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
  }

  return res.status(httpResponse.statusCode).json(httpResponse.body)
}
