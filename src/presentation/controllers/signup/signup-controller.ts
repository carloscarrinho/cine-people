import { AddAccount } from "../../../application/usecases/add-account/add-account";
import { Controller } from "../../protocols/controller";
import { badRequest, serverError, success } from "../../protocols/http-helpers";
import { HttpRequest } from "../../protocols/http-request";
import { HttpResponse } from "../../protocols/http-response";
import { Validation } from "../../protocols/validation";
import { Notifier } from "../../../application/contracts/notifier";
export class SignUpController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly notifier: Notifier,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(request.body);
    if (error) return badRequest(error);

    try {
      const { name, email, password } = request.body;
      const account = await this.addAccount.add({ name, email, password });
      await this.notifier.publish(
        "people_service",
        JSON.stringify({
          personId: account.id,
          eventType: "NEW_PERSON",
        }),
      );

      return success(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
