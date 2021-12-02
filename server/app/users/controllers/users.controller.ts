import express from "express";
import usersService from "../services/users.service";
import argon2 from "argon2";
import debug from "debug";
import { User } from "../model/users.model";

const debugLog: debug.IDebugger = debug("app:users-controller");
import { logger } from "../../../utils/winston";
import { SearchResult } from "../../../common/interfaces/search_result.interface";

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const users = await usersService.list(500, 0);
    res.status(200).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(Number(req.params.userId));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({});
    }
  }

  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    debugLog(await usersService.patchById(req.body));
    res.status(200).send(``);
  }

  async removeUser(req: express.Request, res: express.Response) {
    debugLog(await usersService.deleteById(Number(req.params.userId)));
    res.status(204).send(``);
  }

  async generateToken(req: express.Request, res: express.Response) {
    debugLog("estoy en generateToken");
    let at = await usersService.generateToken(
      req.body.email,
      req.body.password
    );
    if (at === undefined) {
      res.status(404).send();
    } else {
      res.status(200).send(at);
    }
  }

  async getUsers(req: express.Request, res: express.Response) {
    let query: string = req.params.query;

    let sr: SearchResult<User> = await usersService.searchUsers(query);

    sr.data = sr.data.filter((u) => {
      delete u.password;
      return true;
    });

    res.status(200).json(sr);
  }
}

export default new UsersController();
