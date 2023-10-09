import { AdminHandleUserKYCRequestRequest } from "@/common/requests";
import {
    UserKYCRequestResponse,
    UserKYCRequestResponsePagingResponse,
} from "@/common/responses/kycRequest";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, userService } from "@/services";
import { UserService } from "@/services/api/v1/user.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import { UserKYCStatus } from "@prisma/client";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/admin/user-kyc-request",
    name: "AdminManageUserKYCRequest",
})
export class AdminManageUserKYCRequestController extends BaseController {
    constructor() {
        super();
        this.service = userService;
        this.path = "user-kyc-request";
        this.customRouting();
    }
    service: UserService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListUserKYCRequest)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetUserKYCRequestById)
        );
        this.router.patch(
            "/:id/approved",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminApprovedUserKYCRequest)
        );

        this.router.patch(
            "/:id/rejected",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminRejectedUserKYCRequest)
        );
    }

    @ApiOperationPatch({
        path: "/{id}/approved",
        operationId: "adminApprovedUserKYCRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin Approved KYC",
        summary: "Admin Approved KYC",
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
                    schema: { model: AdminHandleUserKYCRequestRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserKYCRequestResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async adminApprovedUserKYCRequest(req: Request, res: Response) {
        const { id } = req.params;
        const adminId = this.getTokenInfo(req).id;
        if (!id) {
            throw errorService.badRequest();
        }
        const adminHandleUserKYCRequestRequest =
            new AdminHandleUserKYCRequestRequest({
                id,
                content: req.body.content,
                adminId,
                userKYCStatus: UserKYCStatus.APPROVED,
            });

        const result = await this.service.adminHandleUserKYCRequest(
            adminHandleUserKYCRequestRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/{id}/rejected",
        operationId: "adminRejectedUserKYCRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin Rejected KYC",
        summary: "Admin Rejected KYC",
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
                    schema: { model: AdminHandleUserKYCRequestRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserKYCRequestResponse },
                    },
                },
                description: "Rejected success",
            },
        },
    })
    async adminRejectedUserKYCRequest(req: Request, res: Response) {
        const { id } = req.params;
        const adminId = this.getTokenInfo(req).id;
        if (!id) {
            throw errorService.badRequest();
        }
        const adminHandleUserKYCRequestRequest =
            new AdminHandleUserKYCRequestRequest({
                id,
                content: req.body.content,
                adminId,
                userKYCStatus: UserKYCStatus.REJECTED,
            });

        const result = await this.service.adminHandleUserKYCRequest(
            adminHandleUserKYCRequestRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListUserKYCRequest",
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
                        schema: {
                            model: UserKYCRequestResponsePagingResponse,
                        },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async adminGetListUserKYCRequest(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.adminGetListUserKYCRequest(
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetUserKYCRequestById",
        description: "Admin get list provider",
        summary: "Admin get list provider",
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
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: {
                            model: UserKYCRequestResponse,
                        },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async adminGetUserKYCRequestById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        if (!req.queryInfoPrisma) req.queryInfoPrisma = {};
        if (!req.queryInfoPrisma.where) req.queryInfoPrisma.where = {};
        req.queryInfoPrisma.where.id = id;
        const result = await this.service.adminGetUserKYCRequest(
            req.queryInfoPrisma
        );
        this.onSuccess(res, result);
    }
}
