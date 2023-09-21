import {
    AdminGetProviderPagingResponse,
    AdminGetProviderResponse,
    AdminGetProviderSkillPagingResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { providerService, providerSkillService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/admin/provider",
    name: "AdminManageProvider",
})
export class AdminManageProviderController extends BaseController {
    constructor() {
        super();
        this.service = providerService;
        this.path = "provider";
        this.customRouting();
    }
    service: ProviderService;
    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListProvider)
        );
        this.router.get(
            "/:slug",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetProviderBySlug)
        );
        this.router.get(
            "/:slug/provider-skill",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetProviderSkillByProviderSlug)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "adminGetListProvider",
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
    async adminGetListProvider(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/{slug}",
        operationId: "adminGetProviderBySlug",
        description: "Get Provider by slug or id",
        summary: "Get Provider by slug or id",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetProviderResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async adminGetProviderBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        if (!queryInfoPrisma.where.OR) queryInfoPrisma.where.OR = [];
        queryInfoPrisma.where.OR = [
            ...queryInfoPrisma.where.OR,
            {
                id: slug,
            },
            {
                slug: slug,
            },
        ];

        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/provider-skill",
        operationId: "adminGetProviderSkillByProviderSlug",
        description: "Get Provider by slug or id",
        summary: "Get Provider by slug or id",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetProviderSkillPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async adminGetProviderSkillByProviderSlug(req: Request, res: Response) {
        const { slug } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};

        const result =
            await providerSkillService.findAndCountAllProviderSkillByProviderSlug(
                slug!,
                queryInfoPrisma
            );
        this.onSuccessAsList(res, result);
    }
}
