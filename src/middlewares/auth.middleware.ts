import { BaseMiddleware } from "./base.middleware";
import * as express from 'express';
import { Request, Response } from "@/controllers/base/base.controller";
import { errorService, tokenService } from "@/services";
import { IAccessToken } from "@/interfaces/auth/accessToken.interface";

const HEADERS = "authorization";
export class AuthMiddleware extends BaseMiddleware {
    override async use(req: Request, _res: Response, next: express.NextFunction) {
        if (req.headers[HEADERS] !== "undefined" && typeof req.headers[HEADERS] != 'undefined') {
            const bearerHeader = req.headers[HEADERS].toString();
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            if (!bearerToken) {
                throw errorService.unauthorized();
            }
            const result: IAccessToken = tokenService.decodeToken(bearerToken) as IAccessToken;
            if (!result.id) {
                throw errorService.badToken();
            }
            req.tokenInfo = result;

            // === Check blocked ====
            // const user_id = req.tokenInfo.payload.user_id;
            // req.userInfo = await userService.checkUserBlockedAndDeleted(user_id)
            //=======================
            next();
        } else {
            throw errorService.unauthorized();
        }
    }

}