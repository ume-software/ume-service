import { AdminHandleWithdrawRequest } from "@/common/requests";
import {
    DepositPagingResponse,
    DepositResponse,
    WithdrawRequestResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { withdrawRequestService } from "@/services";
import { WithdrawRequestService } from "@/services/api/v1/withdrawRequest.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/admin/withdraw-request",
    name: "AdminManageWithdrawRequest",
})
export class AdminManageWithdrawRequestController extends BaseController {
    constructor() {
        super();
        this.service = withdrawRequestService;
        this.path = "withdraw-request";
        this.customRouting();
    }
    service: WithdrawRequestService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListWithdrawRequest)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetOneWithdrawRequest)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminHandleWithdrawRequest)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListWithdrawRequest",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get list withdraw request",
        summary: "Admin get list withdraw request",
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
    async adminGetListWithdrawRequest(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetOneWithdrawRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin get one withdraw request",
        summary: "Admin get one withdraw request",
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
                description: "Rejected success",
            },
        },
    })
    async adminGetOneWithdrawRequest(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
    @ApiOperationPatch({
        path: "/{id}",
        operationId: "adminHandleWithdrawRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin handle withdraw request",
        summary: "Admin handle withdraw request",
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
                    schema: { model: AdminHandleWithdrawRequest },
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
                description: "Rejected success",
            },
        },
    })
    async adminHandleWithdrawRequest(req: Request, res: Response) {
        const { id } = req.params;
        const adminId = this.getTokenInfo(req).id;
        const adminHandleWithdrawRequest = new AdminHandleWithdrawRequest({
            id,
            ...req.body,
        });
        const result = await this.service.adminHandleWithdrawRequest(
            adminId,
            adminHandleWithdrawRequest
        );
        this.onSuccess(res, result);
    }
}
