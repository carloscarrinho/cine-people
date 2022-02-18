import { MissingParamError } from "../errors/missing-param-error";
import { Validation } from "../protocols/validation";

export class RequiredFieldsValidation implements Validation {
  constructor(private readonly fields: string[]) {}
  
  validate (input: any): Error {
    for(const field of this.fields) {
      if(!input[field]) return new MissingParamError(field);
    }

    return null
  }
}