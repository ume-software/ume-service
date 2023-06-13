import { providerRepository } from "@/repositories";
import { BaseController, Request, Response } from "../base/base.controller";
import { providerService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";

export class providerController extends BaseController {
    constructor() {
        super()
        this.service = providerService
        this.path = 'provider'
        this.router.post("/get-list-provider-by-user-ids", this.systemsMiddlewares(), this.route(this.getListProviderByUserIds));


    }
    service: ProviderService
    async getListProviderByUserIds(req: Request, res: Response) {
        const { ids } = req.body;
        const result = await providerRepository.findAndCountAll({
            where: {
                userId: {
                    in: ids as Array<String>
                }
            },
            select: {
                id: true,
                userId: true,
                name: true,
                slug: true,
                avatarUrl: true
            }
        })
        this.onSuccessAsList(res, result)
    }
}