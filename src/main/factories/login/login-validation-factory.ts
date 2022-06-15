import { EmailValidation } from '../../../presentation/validations/email-validation' 
import { RequiredFieldsValidation } from '../../../presentation/validations/required-fields-validation' 
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/validations/validation-composite' 
import { EmailValidatorAdapter } from '../../../infrastructure/services/email-validator/email-validator-adapter' 

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fieldsToValidate = ['email', 'password']

  for (const field of fieldsToValidate) {
    validations.push(new RequiredFieldsValidation([field]))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
