import { HttpRequest } from "./http-request";
import { HttpResponse } from "./http-response";

export interface Controller {
  handle: (request: HttpRequest) => Promise<HttpResponse>;
}