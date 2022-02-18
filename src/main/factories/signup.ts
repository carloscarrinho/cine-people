import { Request, Response } from "express";
import { DbAddAccount } from "../../application/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infrastructure/cryptography/bcrypt-adapter";
import { MongoAccountRepository } from "../../infrastructure/db/repositories/account/mongo-account-repository";
import { EmailValidatorAdapter } from "../../infrastructure/services/email-validator/email-validator-adapter";
import { RabbitMQAdapter } from "../../infrastructure/services/notification-service/rabbitmq-adapter";
import { SignUpController } from "../../presentation/controllers/signup/signup-controller";
import { HttpRequest } from "../../presentation/protocols/http-request";
import { HttpResponse } from "../../presentation/protocols/http-response";
import { Validation } from "../../presentation/protocols/validation";
import { CompareFieldsValidation } from "../../presentation/validations/compare-fields-validation";
import { EmailValidation } from "../../presentation/validations/email-validation";
import { RequiredFieldsValidation } from "../../presentation/validations/required-fields-validation";
import { ValidationComposite } from "../../presentation/validations/validation-composite";

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [];
  const requiredFields = ["name", "email", "password", "passwordConfirmation"];
  const emailValidator = new EmailValidatorAdapter();

  validations.push(new RequiredFieldsValidation(requiredFields));
  validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));
  validations.push(new EmailValidation("email", emailValidator));

  return new ValidationComposite(validations);
};

export const makeSignUpController = (): SignUpController => {
  const validation = makeSignUpValidation();

  const encrypter = new BcryptAdapter(12);
  const mongoAccountRepository = new MongoAccountRepository();
  const dbAddAccount = new DbAddAccount(encrypter, mongoAccountRepository);

  const rabbitMQAdapter = new RabbitMQAdapter();

  return new SignUpController(validation, dbAddAccount, rabbitMQAdapter);
};

export const adaptSignUpController = async (req: Request, res: Response): Promise<Response> => {
  const httpRequest: HttpRequest = { body: req.body };
  const controller = makeSignUpController();
  const httpResponse: HttpResponse = await controller.handle(httpRequest);

  if (httpResponse.statusCode !== 200) {
    return res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }

  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
