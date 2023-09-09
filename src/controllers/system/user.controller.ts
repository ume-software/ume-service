import { Prisma } from "@prisma/client";
import { BaseController, Request, Response } from "../base/base.controller";
import { userService } from "@/services";
import { UserService } from "@/services/api/v1/user.service";

export class UserController extends BaseController {
    constructor() {
        super();
        this.service = userService;
        this.path = "user";
        this.router.post(
            "/sync",
            this.systemsMiddlewares(),
            this.route(this.sync)
        );
    }
    service: UserService;
    async sync(req: Request, res: Response) {
        const userCreateInput: Prisma.UserCreateInput = {
            ...req.body,
        };
        const result = await userService.upsertById(userCreateInput);
        this.onSuccess(res, result);
    }
}
