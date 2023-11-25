import {
    BalanceForUserRequest,
    CreateWithdrawalRequest,
} from "@/common/requests";
import {
    BalanceHistoryPagingResponse,
    WithdrawalRequestResponse,
    UserBalanceResponse,
    BalanceFluctuationStatisticResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import {
    balanceService,
    errorService,
    withdrawalRequestService,
} from "@/services";
import { BalanceService } from "@/services/api/v1/balance.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/balance",
    name: "Balance",
})
export class BalanceController extends BaseController {
    constructor() {
        super();
        this.service = balanceService;
        this.path = "balance";
        this.customRouting();
    }
    service: BalanceService;

    customRouting() {
        this.router.get(
            "/history",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getHistoryBalance)
        );
        this.router.get(
            "/total",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getTotalBalance)
        );
        this.router.get(
            "/fluctuation-statistic",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getBalanceFluctuationStatistics)
        );
        this.router.post(
            "/admin",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminCreatePointForUser)
        );
        this.router.get(
            "/withdrawal-request",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getWithdrawalRequests)
        );
        this.router.post(
            "/withdrawal-request",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createWithdrawalRequest)
        );
        this.router.patch(
            "/cancel-withdrawal-request/:id",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userCancelWithdrawalRequest)
        );
    }
    @ApiOperationGet({
        path: "/history",
        operationId: "getHistoryBalance",
        security: {
            bearerAuth: [],
        },
        description: "Get history balances of the user",
        summary: "Get history balances of the user",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BalanceHistoryPagingResponse },
                    },
                },
                description: "Response balance history success",
            },
        },
    })
    async getHistoryBalance(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        queryInfoPrisma.include = {
            adminCreated: {
                select: {
                    id: true,
                    name: true,
                },
            },
            booking: {
                include: {
                    providerService: {
                        include: {
                            provider: {
                                select: {
                                    id: true,
                                    name: true,
                                    avatarUrl: true,
                                    slug: true,
                                    gender: true,
                                },
                            },
                        },
                    },
                },
            },
            donation: {
                include: {
                    donor: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            avatarUrl: true,
                        },
                    },
                    recipient: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        };

        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getHistoryBalanceByUserId(
            userId!,
            queryInfoPrisma!
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/total",
        operationId: "getTotalBalance",
        security: {
            bearerAuth: [],
        },
        description: "Total number of balances of the user himself",
        summary: "Total number of balances of the user himself",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserBalanceResponse },
                    },
                },
                description: "Get total point success",
            },
        },
    })
    async getTotalBalance(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getTotalBalanceByUserSlug(userId!);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/fluctuation-statistic",
        operationId: "getBalanceFluctuationStatistics",
        security: {
            bearerAuth: [],
        },
        description: "Total number of balances of the user himself",
        summary: "Total number of balances of the user himself",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BalanceFluctuationStatisticResponse },
                    },
                },
                description: "Get total point success",
            },
        },
    })
    async getBalanceFluctuationStatistics(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const data = await this.service.balanceFluctuationByUserIdStatistics(
            userId!
        );
        this.onSuccess(res, { data });
    }

    @ApiOperationPost({
        path: "/admin",
        operationId: "adminCreatePointForUser",
        security: {
            bearerAuth: [],
        },
        description: "Admin create point for user",
        summary: "Admin create point for user",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: BalanceForUserRequest },
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
                description: "Register success",
            },
        },
    })
    async adminCreatePointForUser(req: Request, res: Response) {
        const balanceForUserRequest = new BalanceForUserRequest(req.body);
        const adminId = req.tokenInfo?.id;
        const result = await this.service.adminCreateBalanceToUser(
            adminId!!,
            balanceForUserRequest
        );
        this.onSuccess(res, result);
    }
    @ApiOperationGet({
        path: "/withdrawal-request",
        operationId: "getWithdrawalRequests",
        security: {
            bearerAuth: [],
        },
        description: "User create sell balance",
        summary: "User create sell balance",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: WithdrawalRequestResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async getWithdrawalRequests(req: Request, res: Response) {
        let queryInfoPrisma = req.queryInfoPrisma ?? {};
        const userId = this.getTokenInfo(req).id;
        _.set(queryInfoPrisma, "where.requesterId", userId);
        const result = await withdrawalRequestService.findAndCountAll(
            queryInfoPrisma
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/withdrawal-request",
        operationId: "createWithdrawalRequest",
        security: {
            bearerAuth: [],
        },
        description: "User create sell balance",
        summary: "User create sell balance",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateWithdrawalRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: WithdrawalRequestResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async createWithdrawalRequest(req: Request, res: Response) {
        const createWithdrawalRequest = new CreateWithdrawalRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await withdrawalRequestService.createWithdrawalRequest(
            userId,
            createWithdrawalRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/cancel-withdrawal-request/{id}",
        operationId: "userCancelWithdrawalRequest",
        security: {
            bearerAuth: [],
        },
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
        description: "User Cancel Balance Request",
        summary: "User Cancel Balance Request",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: WithdrawalRequestResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async userCancelWithdrawalRequest(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const userId = this.getTokenInfo(req).id;
        const result =
            await withdrawalRequestService.userCancelWithdrawalRequest({
                id,
                userId,
            });
        this.onSuccess(res, result);
    }
}
