import { InvalidParamError } from "../../../../src/presentation/errors/invalid-param-error";
import { EmailValidator } from "../../../../src/presentation/protocols/email-validator";
import { EmailValidation } from "../../../../src/presentation/validations/email-validation";

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(input: any): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe("Unit", () => {
  describe("Presentation: Validations", () => {
    describe("EmailValidation", () => {
      it("Should return InvalidParamError if a email is invalid", async () => {
        // Given
        const paramName = "email";
        const emailValidator = makeEmailValidator();
        emailValidator.isValid = () => false;
        const sut = new EmailValidation(paramName, emailValidator);

        // When
        const error = sut.validate({ email: 'any_email' });

        // Then
        expect(error).toStrictEqual(new InvalidParamError(paramName));
      });

      it("Should return null if a email is valid", async () => {
        // Given
        const paramName = "email";
        const emailValidator = makeEmailValidator();
        const sut = new EmailValidation(paramName, emailValidator);

        // When
        const error = sut.validate({ email: 'any_email@mail.com' });

        // Then
        expect(error).toBeFalsy();
      });
    });
  });
});
