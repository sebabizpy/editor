import { Connection, createConnection, getConnection } from "typeorm";
import { ConnectionOptions } from "typeorm/connection/ConnectionOptions";
import { ILogObject, Logger } from "tslog";
import { appendFileSync } from "fs";
import debug from "debug";

const debugLog: debug.IDebugger = debug("app:connection");
const debugError: debug.IDebugger = debug("app:connection:error");

// TODO: meter dot_env
export async function getOrCreateConnection() {
  try {
    debugLog("Getting Connection ");
    const conn = getConnection();
    debugLog("Connection found");
    return conn;
  } catch (e: unknown) {
    try {
      debugError(`Error ${e} connection to DB, creating a new one`)
      const options: ConnectionOptions = {
        type: "mysql",
        host: process.env.DB_HOST,
        port: <number>(<any>process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_SCHEMA,
        synchronize: true,
        connectTimeout: 1500,
        logging: process.env.DB_LOGGING === "true",
        entities: ["model/**{.ts,.js}", "app/**/model/**{.ts,.js}"],
        migrationsTableName: "migration_table",
        migrations: ["migration/*.js"],
        cli: {
          migrationsDir: "migration",
        },
      };
      let conn: Connection = await createConnection(options);
      debugError("Connection Created ");
      return conn;
    } catch (e: unknown) {
      debugError(`Could not create a new connection to DB:  ${e}`)
    }
  }
}

export const requiredValidator = (value) =>
  value ? undefined : "Ingrese este campo.";

export const mustBeNumberValidator = (value) =>
  isNaN(value) ? "Este campo debe ser un numero" : undefined;

export const maxValueValidator = (max) => (value) =>
  value != undefined && value.length <= max
    ? undefined
    : `Este campo debe tener menos de ${max} caracteres`;

export const emailValidator = (value) => {
  const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  if (value != "" && (value.length <= 5 || !EMAIL_REGEXP.test(value))) {
    return `Este email no es valido`;
  }
};

export const minValueValidator = (min) => (value) =>
  value != undefined && value.length <= min
    ? undefined
    : `Este campo debe tener mas de ${min} caracteres`;

export const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

function logToTransport(logObject: ILogObject) {
  appendFileSync("logs.txt", JSON.stringify(logObject) + "\n");
}

function logErrorToTransport(logObject: ILogObject) {
  appendFileSync("errors.log", logObject + "\n");
}

const parentLogger: Logger = new Logger();
parentLogger.attachTransport(
  {
    silly: logToTransport,
    debug: logToTransport,
    trace: logToTransport,
    info: logToTransport,
    warn: logToTransport,
    error: logErrorToTransport,
    fatal: logErrorToTransport,
  },
  "debug"
);

export function createLogger(name: string): Logger {
  const logger: Logger = parentLogger.getChildLogger({
    name: name,
  });
  return logger;
}
