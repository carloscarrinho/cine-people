import { badRequest, internalServerError, success, unauthorized } from '../../protocols/http-helpers'
import { HttpRequest } from '../../protocols/http-request'
import { Controller } from '../../protocols/controller'
import { HttpResponse } from '../../protocols/http-response'
import { Authentication } from '../../../application/usecases/authentication/authentication' 
import { Validation } from '../../protocols/validation' 

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(req.body)
    if (error) return badRequest(error)

    try {
      const { email, password } = req.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) return unauthorized()

      return success({ token: accessToken })
    } catch (error) {
      return internalServerError(error)
    }
  }
}
