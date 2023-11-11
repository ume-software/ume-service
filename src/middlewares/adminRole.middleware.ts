import { BaseMiddleware } from "./base.middleware";
import * as express from "express";
import { Request, Response } from "@/controllers/base/base.controller";
import { errorService, tokenService } from "@/services";
import { EAccountType } from "@/enums/accountType.enum";
import { IAccessToken } from "@/interfaces/auth/accessToken.interface";
import prisma from "@/models/base.prisma";
import { AdminRoleType } from "@prisma/client";

const HEADERS = "authorization";
export class AdminRoleMiddleware extends BaseMiddleware {
    override async use(
        req: Request,
        _res: Response,
        next: express.NextFunction,
        option?: AdminRoleType[]
    ) {
        if (!req.tokenInfo) {
            if (
                req.headers[HEADERS] !== "undefined" &&
                typeof req.headers[HEADERS] != "undefined"
            ) {
                const bearerHeader = req.headers[HEADERS].toString();
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
                if (!bearerToken) {
                    throw errorService.unauthorized();
                }
                const result: IAccessToken = tokenService.decodeToken(
                    bearerToken
                ) as IAccessToken;
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
        if (req.tokenInfo.type != EAccountType.ADMIN) {
            throw errorService.unauthorized();
        }
        const roles = (
            await prisma.adminRole.findMany({
                select: { roleType: true },
            })
        ).map((item) => item.roleType);
        if (!roles.length) {
            throw errorService.unauthorized();
        }
        if (option && !option?.length) {
            if (option.findIndex((item) => roles.includes(item)) >= 0) {
                throw errorService.permissionDeny();
            }
        }
        next();
    }
}
