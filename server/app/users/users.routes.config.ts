import { CommonRoutesConfig } from "../../common/common.routes.config";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import express from "express";
import asyncHandler from "express-async-handler";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route(`/api/user`)
      .get(UsersController.listUsers)
      .post(
        asyncHandler(UsersMiddleware.validateRequiredUserBodyFields),
        asyncHandler(UsersMiddleware.validateSameEmailDoesntExist),
        asyncHandler(UsersController.createUser)
      );

    this.app.param(`userId`, UsersMiddleware.extractUserId);
    this.app
      .route(`/api/user/:userId`)
      .all(asyncHandler(UsersMiddleware.validateUserExists))
      .get(asyncHandler(UsersController.getUserById))
      .delete(asyncHandler(UsersController.removeUser));

    this.app
      .route(`/api/user/search/:query`)
      .get(asyncHandler(UsersController.getUsers));

    this.app.patch(`/api/user/:userId`, [
      UsersMiddleware.validatePatchEmail,
      asyncHandler(UsersController.patch),
    ]);

    this.app
      .route(`/api/autho`)
      .post(asyncHandler(UsersController.generateToken));

    return this.app;
  }
}
