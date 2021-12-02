import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../common/exceptions/HttpException";
import debug from "debug";
const debugLog: debug.IDebugger = debug("app:errorMiddleware");

function errorMiddleware(
  error: HttpException | any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  debugLog("Handling Error " + JSON.stringify(error));

  let status = error?.status || 500;
  let message = error?.message || "Something went wrong";

  response.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
