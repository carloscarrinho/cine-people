import { AddAccount } from "../../../../../src/application/usecases/add-account/add-account";
import { SignUpController } from "../../../../../src/presentation/controllers/signup/signup-controller";
import { badRequest, serverError, success } from "../../../../../src/presentation/protocols/http-helpers";
import { HttpRequest } from "../../../../../src/presentation/protocols/http-request";
import { Validation } from "../../../../../src/presentation/protocols/validation";
import { Notifier } from "../../../../../src/application/contracts/notifier";

const makeSut = ({ 
  validate, 
  add, 
  publish 
}: { 
  validate?: Function; 
  add?: Function 
  publish?: Function 
}): SignUpController => {
  const validation = {
    validate: validate ?? jest.fn().mockReturnValueOnce(null),
  } as unknown as Validation;

  const addAccount = {
    add: add ?? jest.fn().mockResolvedValue(account)
  } as unknown as AddAccount;

  const notifier = {
    publish: publish ?? jest.fn().mockResolvedValue(true)
  } as unknown as Notifier;

  return new SignUpController(validation, addAccount, notifier);
};

const makeDefaultRequest = (data?: object): HttpRequest => {
  return {
    body: {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
      passwordConfirmation: "any_password",
      ...data,
    },
  };
};

const account = {
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password",
}

describe("Unit", () => {
  describe("Presentation", () => {
    describe("Controllers: SignUpController", () => {
      it("Should call Validation with correct values", async () => {
        // Given
        const dependencies = { validate: jest.fn() }
        const signUpController = makeSut(dependencies);
        const request = makeDefaultRequest();

        // When
        await signUpController.handle(request);

        // Then
        expect(dependencies.validate).toHaveBeenCalledWith(request.body);
      });

      it("Should return 400 if Validation returns error", async () => {
        // Given
        const signUpController = makeSut({
          validate: jest.fn().mockReturnValueOnce(new Error()),
        });
        const request = makeDefaultRequest();

        // When
        const response = await signUpController.handle(request);

        // Then
        expect(response).toStrictEqual(badRequest(new Error()));
      });

      it("Should call AddAccount with correct values", async () => {
        // Given
        const dependencies = { add: jest.fn() }
        const signUpController = makeSut(dependencies);
        const request = makeDefaultRequest();

        // When
        await signUpController.handle(request);

        // Then
        expect(dependencies.add).toHaveBeenCalledWith({ 
          name: request.body.name, 
          email: request.body.email, 
          password: request.body.password
        });
      });

      it("Should return 500 if throws an error", async () => {
        // Given
        const error = new Error();
        error.stack = 'any_stack';

        const dependencies = { 
          add: jest.fn().mockImplementationOnce(() => { throw error }) }
        const signUpController = makeSut(dependencies);
        const request = makeDefaultRequest();

        // When
        const response = await signUpController.handle(request);

        // Then
        expect(response).toStrictEqual(serverError(error))
      });

      it("Should return 200 if add account successfully", async () => {
        // Given
        const dependencies = { add: jest.fn().mockResolvedValue(account) }
        const signUpController = makeSut(dependencies);
        const request = makeDefaultRequest();

        // When
        const response = await signUpController.handle(request);

        // Then
        expect(response).toStrictEqual(success(account))
      });

      it('Should call Notifier with correct values', async () => {
        // Given
        const dependencies = { publish: jest.fn() }
        const signUpController = makeSut(dependencies);
        const request = makeDefaultRequest();
        const message = {
          personId: account.id,
          eventType: "NEW_PERSON",
        }

        // When
        await signUpController.handle(request);

        // Then
        expect(dependencies.publish).toHaveBeenCalledWith(
          'people_service', 
          JSON.stringify(message)
        );
      });
    });
  });
});
