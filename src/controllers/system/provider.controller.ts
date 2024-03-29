import { userRepository } from "@/repositories";
import { BaseController, Request, Response } from "../base/base.controller";
import { errorService, providerService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";

export class providerController extends BaseController {
    constructor() {
        super();
        this.service = providerService;
        this.path = "provider";
        this.router.get(
            "/get-provider-by-user-id/:id",
            this.systemsMiddlewares(),
            this.route(this.getProviderByUserId)
        );
        this.router.post(
            "/get-list-provider-by-user-ids",
            this.systemsMiddlewares(),
            this.route(this.getListProviderByUserIds)
        );
    }
    private service: ProviderService;

    async getProviderByUserId(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService;
        }
        const result = await userRepository.findOne({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                avatarUrl: true,
            },
        });
        this.onSuccess(res, result);
    }
    async getListProviderByUserIds(req: Request, res: Response) {
        const { ids } = req.body;
        const result = await this.service.findAndCountAll({
            where: {
                userId: {
                    in: ids as Array<String>,
                },
            },
            select: {
                id: true,
                userId: true,
                name: true,
                slug: true,
                avatarUrl: true,
            },
        });
        this.onSuccessAsList(res, result);
    }
}
