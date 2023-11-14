import { AdminHandleWithdrawalRequest } from "@/common/requests";
import {
    DepositPagingResponse,
    DepositResponse,
    WithdrawalRequestResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { withdrawalRequestService } from "@/services";
import { WithdrawalRequestService } from "@/services/api/v1/withdrawalRequest.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/admin/withdrawal-request",
    name: "AdminManageWithdrawalRequest",
})
export class AdminManageWithdrawalRequestController extends BaseController {
    constructor() {
        super();
        this.service = withdrawalRequestService;
        this.path = "withdrawal-request";
        this.customRouting();
    }
    service: WithdrawalRequestService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListWithdrawalRequest)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetOneWithdrawalRequest)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminHandleWithdrawalRequest)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListWithdrawalRequest",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get list withdrawal request",
        summary: "Admin get list withdrawal request",
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
    async adminGetListWithdrawalRequest(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetOneWithdrawalRequest",
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
                description: "Rejected success",
            },
        },
    })
    async adminGetOneWithdrawalRequest(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
    @ApiOperationPatch({
        path: "/{id}",
        operationId: "adminHandleWithdrawalRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin handle withdrawal request",
        summary: "Admin handle withdrawal request",
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
                    schema: { model: AdminHandleWithdrawalRequest },
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
                description: "Rejected success",
            },
        },
    })
    async adminHandleWithdrawalRequest(req: Request, res: Response) {
        const { id } = req.params;
        const adminId = this.getTokenInfo(req).id;
        const adminHandleWithdrawalRequest = new AdminHandleWithdrawalRequest({
            id,
            ...req.body,
        });
        const result = await this.service.adminHandleWithdrawalRequest(
            adminId,
            adminHandleWithdrawalRequest
        );
        this.onSuccess(res, result);
    }
}
