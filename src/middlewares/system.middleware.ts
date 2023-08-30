import { BaseMiddleware } from "./base.middleware";
import * as express from "express";
import { Request, Response } from "@/controllers/base/base.controller";
import { cryptoService, errorService } from "@/services";
import { readFileSync } from "fs";
// import { config } from "@/configs";

const HEADERS = "key";
const privateKey = readFileSync("ume_private_key.pem", "utf8");
export class SystemMiddleware extends BaseMiddleware {
    override async use(
        req: Request,
        _res: Response,
        next: express.NextFunction
    ) {
        if (
            req.headers[HEADERS] !== "undefined" &&
            typeof req.headers[HEADERS] != "undefined"
        ) {
            const publicKey = Buffer.from(
                req.headers[HEADERS].toString(),
                "base64"
            ).toString("utf8");
            if (!cryptoService.areKeysMatching(publicKey, privateKey)) {
                throw errorService.auth.permissionDeny();
            }

            next();
        }
    }
}
