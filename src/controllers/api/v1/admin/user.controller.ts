import {
    AdminGetUserPagingResponseResponse,
    AdminGetUserResponseResponse,
    BalanceHistoryPagingResponse,
    UserBalanceResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { balanceService, errorService, userService } from "@/services";
import { UserService } from "@/services/api/v1/user.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/admin/user",
    name: "AdminManageUser",
})
export class AdminManageUserController extends BaseController {
    constructor() {
        super();
        this.service = userService;
        this.path = "user";
        this.customRouting();
    }
    private service: UserService;

    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListUser)
        );
        this.router.get(
            "/:slug",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetUserBySlug)
        );
        this.router.get(
            "/:slug/balance-history",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetUserBalanceHistoryBySlug)
        );
        this.router.get(
            "/:slug/balance",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetTotalBalanceByUserSlug)
        );
        this.router.patch(
            "/:slug/ban",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminBanUserBySlug)
        );
        this.router.patch(
            "/:slug/un-ban",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminUnBanUserBySlug)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListUser",
        security: {
            bearerAuth: [],
        },
        description: "Get list user",
        summary: "Get list user",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetUserPagingResponseResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async adminGetListUser(req: Request, res: Response) {
        let queryInfoPrisma = req.queryInfoPrisma;

        const result = await userService.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "adminGetUserBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Get user information",
        summary: "Get user information",
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
                        schema: { model: AdminGetUserResponseResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async adminGetUserBySlug(req: Request, res: Response) {
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

        const result = await userService.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
    @ApiOperationGet({
        path: "/{slug}/balance-history",
        operationId: "adminGetUserBalanceHistoryBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Admin get user balance history by slug",
        summary: "Admin get user balance history by slug",
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
                        schema: { model: BalanceHistoryPagingResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async adminGetUserBalanceHistoryBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        const user = await userService.findOne({
            where: {
                OR: [
                    {
                        id: slug,
                    },
                    {
                        slug: slug,
                    },
                ],
            },
        });
        if (!user) {
            throw errorService.error(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        queryInfoPrisma.where.userId = user.id;

        const result = await balanceService.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/balance",
        operationId: "adminGetTotalBalanceByUserSlug",
        security: {
            bearerAuth: [],
        },
        description: "Admin get user balance by slug",
        summary: "Admin get user balance by slug",
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserBalanceResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async adminGetTotalBalanceByUserSlug(req: Request, res: Response) {
        const { slug } = req.params;

        const result = await balanceService.getTotalBalanceByUserSlug(slug!);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/{slug}/ban",
        operationId: "adminBanUserBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Admin Ban user by slug",
        summary: "Admin Ban user by slug",
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetUserResponseResponse },
                    },
                },
                description: "Ban success",
            },
        },
    })
    async adminBanUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const result = await this.service.updateBySlug(slug!, {
            isBanned: true,
        });
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/{slug}/un-ban",
        operationId: "adminUnBanUserBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Admin Un Ban user by slug",
        summary: "Admin Un Ban user by slug",
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetUserResponseResponse },
                    },
                },
                description: "Un ban success",
            },
        },
    })
    async adminUnBanUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const result = await this.service.updateBySlug(slug!, {
            isBanned: false,
        });
        this.onSuccess(res, result);
    }
}
