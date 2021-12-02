import express from "express";
import userService from "../services/users.service";
import debug from "debug";

const debugLog: debug.IDebugger = debug("app:users-middleware");
const debugError: debug.IDebugger = debug("app:users-middleware:error");
import { logger } from "../../../utils/winston";
import jwt from "jsonwebtoken";
import { Connection, getConnection, Repository } from "typeorm";
import { User, ROLE } from "../model/users.model";

class UsersMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.email && req.body.password) {
      next();
    } else {
      res
        .status(400)
        .send({ error: `Missing required fields email and password` });
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      res.status(400).send({ error: `User email already exists` });
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    debugLog("trying to get email");
    try {
      const user = await userService.getUserByEmail(req.body.email);
      if (user && user.id === Number(req.params.userId)) {
        next();
      } else {
        res.status(400).send({ error: `Invalid email` });
      }
    } catch (error) {
      logger.error(error, "validateSameEmailBelongToSameUser");
    }
  }

  // Here we need to use an arrow function to bind `this` correctly
  validatePatchEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.email) {
      debugLog("Validating email", req.body.email);
      await this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  };

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.readById(Number(req.params.userId));
    if (user) {
      req["user"] = user;
      next();
    } else {
      res.status(404).send({ error: `User ${req.params.userId} not found` });
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }

  withProtectRole(minRole: ROLE) {
    return async (req, res, next) => {
      // TODO: Remove in production
      //if (process.env.NODE_ENV !== "production") {
        //next();
        //return;
      //}
      // Get token and check if it exists
      let token;

      try {
        if (req.headers.authorization) {
          token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
          return res.status(401).json({
            success: false,
            message: "Please log in to get access.",
          });
        }

        // Verify token todo: crear interface.
        const decoded: any = await jwt.verify(token, process.env.TOKEN_SECRET);

        // Check if user exists with refresh token
        let connection: Connection = await getConnection();
        let repo: Repository<User> = await connection.getRepository<User>(
          "User"
        );
        const currentUser: User = await repo.findOne(Number(decoded.sub), {relations: ['group']});
        if (!currentUser) {
          return res.status(401).json({
            success: false,
            message: "The user belonging to this token no longer exist.",
          });
        }

        // Grant access to protected route
        res.locals.user = currentUser;
        if (currentUser.role >= minRole) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action.",
          });
        }
        next();
      } catch (error) {
        debugError("Error logging in " + JSON.stringify(error));
        return res.status(401).json({
          success: false,
          message: "Please log in to get access.",
        });
      }
    };
  }
}

export default new UsersMiddleware();
