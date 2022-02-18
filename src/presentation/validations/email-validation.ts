import { InvalidParamError } from "../errors/invalid-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { Validation } from "../protocols/validation";

export class EmailValidation implements Validation {
  constructor(
    private readonly field: string,
    private readonly validator: EmailValidator
  ) {}
  
  validate (input: any): Error {
    const isValid = this.validator.isValid(input[this.field]);
    if (!isValid) return new InvalidParamError(this.field);
    return null
  }
}