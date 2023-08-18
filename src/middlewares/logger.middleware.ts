import { BaseMiddleware } from "./base.middleware";
import * as express from 'express';
import * as _ from 'lodash'
import { Request, Response } from "@/controllers/base/base.controller";
import { config } from "@/configs";

export class LoggerMiddleware extends BaseMiddleware {
    override async use(req: Request, _res: Response, next: express.NextFunction) {
        const loggers = config.server.logger
        for (const logger of loggers) {
            console.log(`[${logger.toLocaleUpperCase()}] : `, req[logger])
        }
        next();
    }

}