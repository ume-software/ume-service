import { BaseController, Request, Response } from "../base/base.controller";
import { errorService, userService } from "@/services";

export class SystemUserController extends BaseController {
    constructor() {
        super();
        this.path = "user";
        this.router.get(
            "/",
            this.systemsMiddlewares(),
            this.route(this.getList)
        );
        this.router.get(
            "/:userId",
            this.systemsMiddlewares(),
            this.route(this.getUserId)
        );
        this.router.post(
            "/get-list-user-by-ids",
            this.systemsMiddlewares(),
            this.route(this.getListUserByIds)
        );
    }
    async getUserId(req: Request, res: Response) {
        const { userId } = req.params;
        if (!userId) {
            throw errorService.badRequest();
        }
        const result = await userService.findOne({
            where: {
                id: userId,
            },
        });
        this.onSuccess(res, result);
    }
    async getList(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const results = await userService.findMany(queryInfoPrisma);
        this.onSuccess(res, { results });
    }

    async getListUserByIds(req: Request, res: Response) {
        const { ids } = req.body;
        const result = await userService.findAndCountAll({
            where: {
                id: {
                    in: ids as Array<String>,
                },
            },
            select: {
                id: true,
                name: true,
                slug: true,
                avatarUrl: true,
            },
        });
        this.onSuccessAsList(res, result);
    }
}
