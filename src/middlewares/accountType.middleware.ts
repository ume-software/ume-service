import { BaseMiddleware } from "./base.middleware";
import * as express from 'express';
import { Request, Response } from "@/controllers/base/base.controller";
import { errorService, tokenService } from "@/services";
import { EAccountType } from "@/enums/accountType.enum";
import { IAccessToken } from "@/interfaces/auth/accessToken.interface";


const HEADERS = "authorization";
export class AccountTypeMiddleware extends BaseMiddleware {
    override async use(req: Request, _res: Response, next: express.NextFunction, option?: EAccountType[]) {
        if (!req.tokenInfo) {
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
            } else {
                throw errorService.unauthorized();
            }
        }
        if (!option?.length) {

            const checkAccountTypes = option?.includes(req.tokenInfo.type)
            if (!checkAccountTypes) {
                throw errorService.unauthorized();
            }
        }
        next();
    }

}