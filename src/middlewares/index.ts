import { AuthMiddleware } from "./auth.middleware";
import { AuthOrUnAuthMiddleware } from "./authOrUnAuth.middleware";
import { LoggerMiddleware } from "./logger.middleware";
import { MorganMiddleware } from "./morgan.middleware";
import { ParseRequestMiddleware } from "./parseRequest.middleware";
import { QueryPrismaMiddleware } from "./queryPrisma.middleware";
import { RoleMiddleware } from "./role.middleware";


const queryPrismaMiddleware = new QueryPrismaMiddleware();
const loggerMiddleware = new LoggerMiddleware();
const morganMiddleware = new MorganMiddleware();
const parseRequestMiddleware = new ParseRequestMiddleware();
const authMiddleware = new AuthMiddleware();
const authOrUnAuthMiddleware = new AuthOrUnAuthMiddleware();
const roleMiddleware = new RoleMiddleware();
export {
    queryPrismaMiddleware,
    loggerMiddleware,
    morganMiddleware,
    parseRequestMiddleware,
    authMiddleware,
    authOrUnAuthMiddleware,
    roleMiddleware
}