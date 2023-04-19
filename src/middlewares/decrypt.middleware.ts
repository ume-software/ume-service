import { BaseMiddleware } from "./base.middleware";
import * as express from 'express';
import * as _ from 'lodash'
import { Request, Response } from "@/controllers/base/base.controller";
import { cryptoService } from "@/services";
import { config } from "@/configs";

export class DecryptMiddleware extends BaseMiddleware {
    override async use(req: Request, _res: Response, next: express.NextFunction) {
        if (req.body.data) {
            const data: string = req.body.data;
            const cryptoData: string = cryptoService.decryptStringWithRsaPrivateKey(data, config.server.private_key);
            req.body = JSON.parse(cryptoData)
        }
        next();
    }

}