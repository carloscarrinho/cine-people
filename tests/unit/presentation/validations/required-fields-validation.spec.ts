import { MissingParamError } from "../../../../src/presentation/errors/missing-param-error";
import { RequiredFieldsValidation } from "../../../../src/presentation/validations/required-fields-validation";

describe('Unit', () => {
  describe('Presentation: Validations', () => {
    describe('RequiredFieldsValidation', () => {
      it('Should return MissingParamError if a required field is not provided', async () => {
        // Given
        const paramName = 'any_field'
        const sut = new RequiredFieldsValidation([paramName]);
        
        // When
        const error = sut.validate({});
        
        // Then
        expect(error).toStrictEqual(new MissingParamError(paramName))
      });

      it('Should return null if a required field is provided', async () => {
        // Given
        const paramName = 'name'
        const sut = new RequiredFieldsValidation([paramName]);
        
        // When
        const error = sut.validate({ name: 'any_name' });
        
        // Then
        expect(error).toBeFalsy()
      });
    });
  });
});