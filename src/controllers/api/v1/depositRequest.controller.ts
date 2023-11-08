import {
    CreateDepositRequest,
    DepositCalculateRequest,
    DepositCalculateListRequest,
    DepositHandleRequest,
} from "@/common/requests";
import {
    DepositResponse,
    DepositCalculateResponse,
    DepositCalculateListResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { depositRequestService } from "@/services";
import { DepositRequestService } from "@/services/api/v1/depositRequest.service";
import { handlerFilterDepositParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/deposit-request",
    name: "DepositRequest",
})
export class DepositRequestController extends BaseController {
    constructor() {
        super();
        this.service = depositRequestService;
        this.path = "deposit-request";
        this.customRouting();
    }
    service: DepositRequestService;

    customRouting() {
        this.router.get(
            "/request-to-handler",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.getDepositRequestToHandler)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createDepositRequest)
        );
        this.router.post("/calculate", this.route(this.depositCalculate));
        this.router.post(
            "/calculate-list",
            this.route(this.depositCalculateList)
        );
        this.router.post(
            "/handle",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.handleDepositRequest)
        );
    }
    @ApiOperationGet({
        path: "/request-to-handler",
        operationId: "getDepositRequestToHandler",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: handlerFilterDepositParameters,
        },
        description: "Handler get all buy coin request to them",
        summary: "Handler get all buy coin request to them",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositResponse },
                    },
                },
                description: "Get list buy coin request success",
            },
        },
    })
    async getDepositRequestToHandler(req: Request, res: Response) {
        let queryInfoPrisma = req.queryInfoPrisma;
        const { transaction_code: transactionCode, status } = req.query;
        const userId = this.getTokenInfo(req).id;
        if (!queryInfoPrisma) queryInfoPrisma = {};
        delete queryInfoPrisma.select;
        delete queryInfoPrisma.include;
        queryInfoPrisma.where = {
            handlerId: userId,
        };
        if (transactionCode) {
            queryInfoPrisma.where.transactionCode = {
                contains: transactionCode,
            };
        }
        if (status) {
            queryInfoPrisma.where.status = status;
        }
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createDepositRequest",
        security: {
            bearerAuth: [],
        },
        description: "User create buy coin request",
        summary: "User create buy coin request",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateDepositRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositResponse },
                    },
                },
                description: "Create buy coin request success",
            },
        },
    })
    async createDepositRequest(req: Request, res: Response) {
        const createDepositRequest = new CreateDepositRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.createDeposit(
            userId,
            createDepositRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/calculate",
        operationId: "depositCalculate",
        security: {
            bearerAuth: [],
        },
        description: "User create buy coin request",
        summary: "User create buy coin request",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: DepositCalculateRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositCalculateResponse },
                    },
                },
                description: "Create buy coin request success",
            },
        },
    })
    async depositCalculate(req: Request, res: Response) {
        const depositCalculateRequest = new DepositCalculateRequest(req.body);
        const result = await this.service.depositCalculate(
            depositCalculateRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/calculate-list",
        operationId: "depositCalculateList",
        security: {
            bearerAuth: [],
        },
        description: "User create buy coin request",
        summary: "User create buy coin request",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: DepositCalculateListRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositCalculateListResponse },
                    },
                },
                description: "Create buy coin request success",
            },
        },
    })
    async depositCalculateList(req: Request, res: Response) {
        const depositCalculateListRequest = new DepositCalculateListRequest(
            req.body
        );
        const result = await this.service.depositCalculateList(
            depositCalculateListRequest
        );
        this.onSuccess(res, result);
    }
    @ApiOperationPost({
        path: "/handle",
        operationId: "handleDepositRequest",
        security: {
            bearerAuth: [],
        },
        description: "Handle buy coin request",
        summary: "Handle buy coin request",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: DepositHandleRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositResponse },
                    },
                },
                description: "Handle buy coin request success",
            },
        },
    })
    async handleDepositRequest(req: Request, res: Response) {
        const depositHandleRequest = new DepositHandleRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.depositHandle(
            userId!!,
            depositHandleRequest
        );
        this.onSuccess(res, result);
    }
}
