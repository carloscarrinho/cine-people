/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptLoginController } from '../factories/login/login-factory'

export default async (router: Router): Promise<void> => {
  router.post('/login', adaptLoginController)
}
