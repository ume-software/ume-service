import { CreateBannerRequest, UpdateBannerRequest } from "@/common/requests";
import {
    DepositPagingResponse,
    DepositResponse,
    BannerResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bannerService, errorService } from "@/services";
import { BannerService } from "@/services/api/v1/banner.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationDelete,
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/admin/banner",
    name: "AdminManageBanner",
})
export class AdminManageBannerController extends BaseController {
    constructor() {
        super();
        this.service = bannerService;
        this.path = "banner";
        this.customRouting();
    }
    private service: BannerService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListBanner)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetOneBanner)
        );
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminCreateBanner)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminUpdateBanner)
        );
        this.router.delete(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminDeleteBanner)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListBanner",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get list banner",
        summary: "Admin get list banner",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositPagingResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async adminGetListBanner(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetOneBanner",
        security: {
            bearerAuth: [],
        },
        description: "Admin get one withdrawal request",
        summary: "Admin get one withdrawal request",
        parameters: {
            path: {
                id: {
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
                        schema: { model: DepositResponse },
                    },
                },
                description: "Admin get one banner",
            },
        },
    })
    async adminGetOneBanner(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
    @ApiOperationPost({
        path: "",
        operationId: "adminCreateBanner",
        security: {
            bearerAuth: [],
        },
        description: "Admin create banner",
        summary: "Admin create banner",

        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateBannerRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BannerResponse },
                    },
                },
                description: "Admin create banner",
            },
        },
    })
    async adminCreateBanner(req: Request, res: Response) {
        const adminCreateBanner = new CreateBannerRequest(req.body);
        const result = await this.service.create(adminCreateBanner);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/{id}",
        operationId: "adminUpdateBanner",
        security: {
            bearerAuth: [],
        },
        description: "Admin update banner",
        summary: "Admin update banner",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateBannerRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BannerResponse },
                    },
                },
                description: "Admin update banner",
            },
        },
    })
    async adminUpdateBanner(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const adminUpdateBanner = new UpdateBannerRequest(req.body);
        const result = await this.service.updateById(id, adminUpdateBanner);
        this.onSuccess(res, result);
    }
    @ApiOperationDelete({
        path: "/{id}",
        operationId: "adminDeleteBanner",
        security: {
            bearerAuth: [],
        },
        description: "Admin update banner",
        summary: "Admin update banner",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateBannerRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BannerResponse },
                    },
                },
                description: "Admin update banner",
            },
        },
    })
    async adminDeleteBanner(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const result = await this.service.deleteById(id);
        this.onSuccess(res, result);
    }
}
