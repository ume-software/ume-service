import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { adminService, errorService } from "@/services";
import { AdminService } from "@/services/api/v1/admin.service";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { CreateAdminAccountRequest } from "@/common/requests";
import { AdminInformationResponse } from "@/common/responses/admin";
import { UpdateAdminAccountRequest } from "@/common/requests/admin/updateAdminAccount.request";
import { AdminRoleType } from "@prisma/client";
import { queryParameters } from "@/swagger/parameters/query.parameter";

@ApiPath({
    path: "/api/v1/admin/account",
    name: "admin",
})
export class AccountAdminController extends BaseController {
    constructor() {
        super();
        this.service = adminService;
        this.path = "account";
        this.customRouting();
    }
    service: AdminService;

    customRouting() {
        this.router.get(
            "",
            this.adminRoleMiddlewares([AdminRoleType.SUPER_ADMIN]),
            this.route(this.supperAdminGetListAdminAccount)
        );
        this.router.get(
            "/:id",
            this.adminRoleMiddlewares([AdminRoleType.SUPER_ADMIN]),
            this.route(this.supperAdminGetAdminById)
        );
        this.router.post(
            "",
            this.adminRoleMiddlewares([AdminRoleType.SUPER_ADMIN]),
            this.route(this.adminCreateAccount)
        );
        this.router.patch(
            "/:id",
            this.adminRoleMiddlewares([AdminRoleType.SUPER_ADMIN]),
            this.route(this.supperUpdateAdminById)
        );
    }

    @ApiOperationPost({
        path: "",
        operationId: "adminCreateAccount",
        description: "Admin create account",
        summary: "Admin create account",
        security: {
            bearerAuth: [],
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateAdminAccountRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminInformationResponse },
                    },
                },
                description: "Admin response",
            },
        },
    })
    async adminCreateAccount(req: Request, res: Response) {
        const createAdminAccountRequest = new CreateAdminAccountRequest(
            req.body
        );
        const adminId = this.getTokenInfo(req).id;
        const result = await this.service.adminCreateAccount(
            adminId!,
            createAdminAccountRequest
        );
        this.onSuccess(res, result);
    }
    @ApiOperationGet({
        path: "",
        operationId: "supperAdminGetListAdminAccount",
        description: "Supper Admin Get List Admin Account",
        summary: "Supper Admin Get List Admin Account",
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
                        schema: { model: AdminInformationResponse },
                    },
                },
                description: "Admin response",
            },
        },
    })
    async supperAdminGetListAdminAccount(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/{id}",
        operationId: "supperAdminGetAdminById",
        description: "Supper Admin Get Admin By Id",
        summary: "Supper Admin Get Admin By Id",
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
                        schema: { model: AdminInformationResponse },
                    },
                },
                description: "Admin response",
            },
        },
    })
    async supperAdminGetAdminById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        if (!queryInfoPrisma.where.id) queryInfoPrisma.where.id = id;
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPatch({
        path: "/{id}",
        operationId: "supperUpdateAdminById",
        description: "Supper Admin Get Admin By Id",
        summary: "Supper Admin Get Admin By Id",
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
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateAdminAccountRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminInformationResponse },
                    },
                },
                description: "Admin response",
            },
        },
    })
    async supperUpdateAdminById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const updateAdminAccountRequest = new UpdateAdminAccountRequest(
            req.body
        );
        const result = await this.service.updateById(
            id,
            updateAdminAccountRequest
        );
        this.onSuccessAsList(res, result);
    }
}
