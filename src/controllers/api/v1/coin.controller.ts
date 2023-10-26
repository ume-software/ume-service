import { CoinForUserRequest, CreateWithdrawRequest } from "@/common/requests";
import {
    CoinHistoryPagingResponse,
    WithdrawRequestResponse,
    UserCoinResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { coinService, errorService, withdrawRequestService } from "@/services";
import { CoinService } from "@/services/api/v1/coin.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/coin",
    name: "Coin",
})
export class CoinController extends BaseController {
    constructor() {
        super();
        this.service = coinService;
        this.path = "coin";
        this.customRouting();
    }
    service: CoinService;

    customRouting() {
        this.router.get(
            "/history",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getHistoryCoin)
        );
        this.router.get(
            "/total",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getTotalCoin)
        );
        this.router.post(
            "/admin",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminCreatePointForUser)
        );
        this.router.post(
            "/withdrawal-request",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createWithdrawRequest)
        );
        this.router.patch(
            "/cancel-withdrawal-request/:withdrawal-request-id",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createWithdrawRequest)
        );
    }
    @ApiOperationGet({
        path: "/history",
        operationId: "getHistoryCoin",
        security: {
            bearerAuth: [],
        },
        description: "Get history coins of the user",
        summary: "Get history coins of the user",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: CoinHistoryPagingResponse },
                    },
                },
                description: "Response coin history success",
            },
        },
    })
    async getHistoryCoin(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getHistoryCoinByUserId(
            userId!,
            queryInfoPrisma!
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/total",
        operationId: "getTotalCoin",
        security: {
            bearerAuth: [],
        },
        description: "Total number of coins of the user himself",
        summary: "Total number of coins of the user himself",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserCoinResponse },
                    },
                },
                description: "Get total point success",
            },
        },
    })
    async getTotalCoin(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getTotalCoinByUserSlug(userId!);
        this.onSuccess(res, result);
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
                    schema: { model: CoinForUserRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserCoinResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async adminCreatePointForUser(req: Request, res: Response) {
        const coinForUserRequest = new CoinForUserRequest(req.body);
        const adminId = req.tokenInfo?.id;
        const result = await this.service.adminCreatePointToUser(
            adminId!!,
            coinForUserRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/withdrawal-request",
        operationId: "createWithdrawRequest",
        security: {
            bearerAuth: [],
        },
        description: "User create sell coin",
        summary: "User create sell coin",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateWithdrawRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: WithdrawRequestResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async createWithdrawRequest(req: Request, res: Response) {
        const createWithdrawRequest = new CreateWithdrawRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await withdrawRequestService.createSellCoin(
            userId,
            createWithdrawRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/cancel-withdrawal-request/{withdrawal-request-id}",
        operationId: "userCancelCoinRequest",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                "withdrawal-request-id": {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        description: "Admin create point for user",
        summary: "Admin create point for user",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: WithdrawRequestResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async userCancelCoinRequest(req: Request, res: Response) {
        const { "withdrawal-request-id": id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const userId = this.getTokenInfo(req).id;
        const result = await withdrawRequestService.userCancelCoinRequest({
            id,
            userId,
        });
        this.onSuccess(res, result);
    }
}
