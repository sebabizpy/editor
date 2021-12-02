import UsersDao from "../dao/users.dao";
import argon2 from "argon2";
import { CRUD } from "../../../common/interfaces/crud.interface";
import { User } from "../model/users.model";
import jwt from "jsonwebtoken";
import debug from "debug";
import { logger } from "../../../utils/winston";

const debugLog: debug.IDebugger = debug("app:users-service");
import { SearchResult } from "../../../common/interfaces/search_result.interface";

class UsersService {
  async create(user: any) {
    return UsersDao.createUser(user);
  }

  async deleteById(resourceId: number): Promise<any> {
    return UsersDao.removeUserById(resourceId);
  }

  async list(limit: number, page: number) {
    throw new Error("Implement me");
    return null;
  }

  async patchById(user: User) {
    return UsersDao.patchUserById(user);
  }

  async readById(id: number) {
    return UsersDao.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  async generateToken(
    email: string,
    password: string
  ): Promise<{ access_token: string; user: User }> {
    debugLog("generateToken");
    let user: User = await this.getUserByEmail(email);

    // TODO: use this one when you dont use the pass plain in db
    // if (user != undefined && argon2.verify(user.password, password)) {
    if (user != undefined && user.password === password) {
      const claim: { sub: string } = { sub: user.id.toString() };
      const at: string = jwt.sign(claim, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      return { access_token: at, user: user };
    }
  }

  async search(query: string): Promise<SearchResult<User>> {
    return await UsersDao.search(query);
  }

  async searchUsers(query: string) {
    return await UsersDao.search(query);
  }
}

export default new UsersService();
