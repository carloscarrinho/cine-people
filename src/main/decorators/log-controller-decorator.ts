import { LogErrorRepository } from "../../application/contracts/log/log-error-repository";
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest } from "../../presentation/protocols/http-request"; 
import { HttpResponse } from "../../presentation/protocols/http-response"; 

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request);

    if (httpResponse?.statusCode === 500) {
      await this.logErrorRepository.log(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
