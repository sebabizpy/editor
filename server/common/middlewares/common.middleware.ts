import express from "express";

class CommonMiddleware {
  async setIdFromParamToBody(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.id;
    next();
  }
}

export default new CommonMiddleware();
