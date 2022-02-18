import { InvalidParamError } from "../../../../src/presentation/errors/invalid-param-error";
import { CompareFieldsValidation } from "../../../../src/presentation/validations/compare-fields-validation";

describe('Unit', () => {
  describe('Presentation: Validations', () => {
    describe('CompareFieldsValidation', () => {
      it('Should return InvalidParamError if password and passwordConfirmatio fields do not match', async () => {
        // Given
        const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
        
        // When
        const error = sut.validate({
          password: 'any_password',
          passwordConfirmation: 'other_password',
        });
        
        // Then
        expect(error).toStrictEqual(new InvalidParamError('passwordConfirmation'))
      });

      it('Should return null if password and passwordConfirmatio fields match', async () => {
        // Given
        const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
        
        // When
        const error = sut.validate({
          password: 'same_password',
          passwordConfirmation: 'same_password',
        });
        
        // Then
        expect(error).toBeFalsy()
      });
    });
  });
});