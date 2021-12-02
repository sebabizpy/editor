import { User } from "../model/users.model";

import { Connection, Repository } from "typeorm";
import { SearchResult } from "../../../common/interfaces/search_result.interface";
import debug from "debug";
const debugLog: debug.IDebugger = debug("app:user-dao");
import { logger } from "../../../utils/winston";
import { getOrCreateConnection } from "../../../utils";
import { HttpException } from "../../../common/exceptions/HttpException";

class UsersDao {
  private static async getRepo(): Promise<Repository<User>> {

    let c: Connection = await getOrCreateConnection();
    return c.getRepository<User>("User");
  }

  async createUser(user: User): Promise<User> {
    debugLog("User " + JSON.stringify(user));
    let repo = await UsersDao.getRepo();
    return await repo.save(user);
  }

  async getUserById(userId: number): Promise<User> {
    let repo = await UsersDao.getRepo();
    return await repo.findOne(Number(userId));
  }

  async patchUserById(user: User) {
    debugLog("user ");
    let repo = await UsersDao.getRepo();
    debugLog("user " + JSON.stringify(user));
    let currentUser: User = await this.getUserById(user.id);
    debugLog("currentUser " + JSON.stringify(currentUser));
    const allowedPatchFields = [
      "firstName",
      "lastName",
      "phone",
      "celPhone",
      "address",
      "cp",
      "province",
      "city",
      "role",
    ];
    for (let field of allowedPatchFields) {
      if (field in user) {
        // @ts-ignore
        currentUser[field] = user[field];
      }
    }
    delete user.id;
    await repo.save({
      ...currentUser,
      ...user,
    });
    return `User #${currentUser.id} patched`;
  }

  async removeUserById(userId: number): Promise<boolean> {
    let u = await this.getUserById(userId);
    let repo = await UsersDao.getRepo();
    if (u === undefined) {
      throw new HttpException(404, "Not Found");
    }
    try {
      await repo.remove(u);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    let repo = await UsersDao.getRepo();
    let u: User = await repo.findOne({ email: email });
    if (u) {
      return u;
    } else {
      return null;
    }
  }

  async search(query: string): Promise<SearchResult<User>> {
    let repo = await UsersDao.getRepo();
    const take: number = 500;
    let result: User[], total: number;
    try {
      const builder = repo.createQueryBuilder("user").take(take);

      if (query === "_all_") {
        [result, total] = await builder.getManyAndCount();
      } else {
        [result, total] = await builder
          .where("user.firstName like :c ", {
            c: `%${query}%`,
          })
          .orWhere("user.lastName like :o ", {
            o: `%${query}%`,
          })
          .getManyAndCount();
      }
    } catch (e) {
      logger.error(e);
    }
    return { data: result, total: total };
  }
}

export default new UsersDao();
