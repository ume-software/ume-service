import { BaseController } from "@/controllers/base/base.controller";
import { adminService, authService } from "@/services";
import { Request, Response } from "@/controllers/base/base.controller";
import { AuthService } from "@/services/api/v1/auth.service";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { EAccountType } from "@/enums/accountType.enum";
import {
    LoginInAppRequest,
    RenewTokenRequest,
} from "@/common/requests";
import {
    RenewTokenResponse,
    AdminLoginResponse,
} from "@/common/responses/auth";
import { AdminInformationResponse } from "@/common/responses/admin";

@ApiPath({
    path: "/api/v1/admin/auth",
    name: "AdminAuth",
})
export class AdminAuthController extends BaseController {
    constructor() {
        super();
        this.service = authService;
        this.path = "auth";
        this.router.get(
            "/info",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.getAdminInfo)
        );
        this.router.post("/login", this.route(this.adminLogin));
        this.router.post("/renew-token", this.route(this.adminRenewToken));
    }
    service: AuthService;

    @ApiOperationPost({
        path: "/login",
        operationId: "adminLogin",
        description: "Get seft information for admin",
        summary: "Get seft information for admin",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: LoginInAppRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminLoginResponse },
                    },
                },
                description: "Login success",
            },
        },
    })
    async adminLogin(req: Request, res: Response) {
        const loginInAppRequest = new LoginInAppRequest({
            ...req.body,
            ipv4: req.ipv4,
        });
        const loginResponse: AdminLoginResponse = await this.service.adminLogin(
            loginInAppRequest
        );
        this.onSuccess(res, loginResponse);
    }

    @ApiOperationGet({
        path: "/info",
        operationId: "getAdminInfo",
        security: {
            bearerAuth: [],
        },
        description: "Login with username and password",
        summary: "Login In App",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminInformationResponse },
                    },
                },
                description: "Renew token success",
            },
        },
    })
    async getAdminInfo(req: Request, res: Response) {
        const id = this.getTokenInfo(req).id;
        const result = await adminService.getInfoByAdminId(id!!);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/renew-token",
        operationId: "adminRenewToken",
        description: "Admin Renew Token",
        summary: "Admin Renew Token",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: RenewTokenRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: RenewTokenResponse },
                    },
                },
                description: "Renew token success",
            },
        },
    })
    async adminRenewToken(req: Request, res: Response) {
        const renewTokenRequest = new RenewTokenRequest({
            ...req.body,
            ipv4: req.ipv4,
        });
        const result = await this.service.renewTokenInApp(renewTokenRequest);
        this.onSuccess(res, result);
    }
}
