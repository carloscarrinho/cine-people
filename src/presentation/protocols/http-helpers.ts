import { ServerError } from "../errors/server-error";
import { HttpResponse } from "./http-response";

export const success = (data: object): HttpResponse => ({
  statusCode: 200,
  body: data 
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error 
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack) 
});