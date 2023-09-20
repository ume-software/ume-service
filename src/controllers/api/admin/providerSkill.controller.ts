import { AdminGetProviderPagingResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { providerSkillService } from "@/services";
import { ProviderSkillService } from "@/services/api/v1/providerSkill.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/admin/provider-skill",
    name: "AdminManageProviderSkill",
})
export class AdminManageProviderController extends BaseController {
    constructor() {
        super();
        this.service = providerSkillService;
        this.path = "provider-skill";
        this.customRouting();
    }
    service: ProviderSkillService;
    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListProviderSkill)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "adminGetListProviderSkill",
        description: "Admin get list provider",
        summary: "Admin get list provider",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetProviderPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async adminGetListProviderSkill(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
