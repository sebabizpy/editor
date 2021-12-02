import { promisify } from "util";
import jwt from "jsonwebtoken";
import { Connection, getConnection, Repository } from "typeorm";
import { User } from "./../../app/users/model/users.model";

export const withProtectRole = (handler, ...roles) => {
  return async (req, res) => {
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
      } else {
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to perform this action.",
          });
        }
      }

      // Verify token
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      // Check if user exists with refresh token
      let connection: Connection = await getConnection();
      let repo: Repository<User> = await connection.getRepository<User>("User");
      const currentUser = await repo.findOne(Number(decoded));
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "The user belonging to this token no longer exist.",
        });
      }

      // Grant access to protected route
      req.user = currentUser;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Please log in to get access.",
      });
    }
  };
};
