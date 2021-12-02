import express from "express";
import * as http from "http";
import * as bodyparser from "body-parser";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./app/users/users.routes.config";
import debug from "debug";
import winston from "winston";
import "dotenv/config";
import { morganMiddleware } from "./utils/middleware/morgan_middleware";
import { getOrCreateConnection } from "./utils";
import errorMiddleware from "./utils/middleware/error.middleware";
import path from "path";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

getOrCreateConnection().then(async () => {
  app.use(bodyparser.json());
  app.use(cors());

  // TODO: meter jwt middleware.
  // ROUTES

  routes.push(new UsersRoutes(app));


  app.use(morganMiddleware);
  app.use(errorMiddleware);
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
  );

  // add middlewares
  app.use(express.static(path.join(__dirname, "..", "client/build")));
  app.use(express.static("public"));

  app.use((req, res, next) => {
    console.log(
      `PATH: ${path.join(__dirname, "..", "client/build", "index.html")}`
    );
    res.sendFile(path.join(__dirname, "..", "client/build", "index.html"));
  });

  // start express server on port 5000
  server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
      debugLog(`Routes configured for ${route.getName()}`);
    });
  });
});
