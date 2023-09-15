import { BaseController } from "@/controllers/base/base.controller";
import { adminService, authService, userService } from "@/services";
import { Request, Response } from "@/controllers/base/base.controller";
import { AuthService } from "@/services/api/v1/auth.service";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { LoginType } from "@prisma/client";
import { EAccountType } from "@/enums/accountType.enum";
import {
    LoginInAppRequest,
    RegisterInAppRequest,
    RenewTokenRequest,
    LoginSNSRequest,
} from "@/common/requests";
import { UserLoginResponse, RenewTokenResponse, AdminLoginResponse } from "@/common/responses/auth";
import { UserInformationResponse } from "@/common/responses";
import { AdminInformationResponse } from "@/common/responses/admin";

@ApiPath({
    path: "/api/v1/auth",
    name: "Auth",
})
export class AuthController extends BaseController {
    constructor() {
        super();
        this.service = authService;
        this.path = "auth";
        this.router.get(
            "/info",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getInfo)
        );
        this.router.post("/login", this.route(this.userLoginInApp));
        this.router.post("/register", this.route(this.userRegisterInApp));
        this.router.post("/renew-token", this.route(this.renewToken));
        this.router.post("/login-sns", this.route(this.userLoginSns));
        this.router.get(
            "/admin/info",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.getAdminInfo)
        );
        this.router.post("/admin/login", this.route(this.adminLogin));
        this.router.post(
            "/admin/register",
            this.route(this.adminRegisterAccount)
        );
        this.router.post(
            "/admin/renew-token",
            this.route(this.adminRenewToken)
        );
    }
    service: AuthService;

    @ApiOperationGet({
        path: "/info",
        operationId: "getInfo",
        security: {
            bearerAuth: [],
        },
        description: "Get seft information",
        summary: "Get seft information",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async getInfo(req: Request, res: Response) {
        const id = this.getTokenInfo(req).id;
        const result = await userService.getInfoByUserId(id!!);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/login",
        operationId: "loginInApp",
        description: "Login with username and password",
        summary: "Login In App",
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
                        schema: { model: UserLoginResponse },
                    },
                },
                description: "Login success",
            },
        },
    })
    async userLoginInApp(req: Request, res: Response) {
        const loginInAppRequest = new LoginInAppRequest({
            ...req.body,
            ipv4: req.ipv4,
        });
        const loginResponse: UserLoginResponse =
            await this.service.userLoginInApp(loginInAppRequest);
        this.onSuccess(res, loginResponse);
    }

    @ApiOperationPost({
        path: "/register",
        operationId: "registerInApp",
        description: "Register In App",
        summary: "Register",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: RegisterInAppRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserLoginResponse },
                    },
                },
                description: "Register token success",
            },
        },
    })
    async userRegisterInApp(req: Request, res: Response) {
        const registerInAppRequest = new RegisterInAppRequest({
            ...req.body,
            ipv4: req.ipv4,
            loginType: LoginType.INAPP,
        });
        const result = await this.service.userRegisterInApp(
            registerInAppRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/renew-token",
        operationId: "renewToken",
        description: "Renew Token",
        summary: "Renew Token",
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
    async renewToken(req: Request, res: Response) {
        const renewTokenRequest = new RenewTokenRequest({
            ...req.body,
            ipv4: req.ipv4,
        });
        const result = await this.service.renewTokenInApp(renewTokenRequest);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/login-sns",
        operationId: "loginSNS",
        description: "Login SNS",
        summary: "Login SNS",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: LoginSNSRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserLoginResponse },
                    },
                },
                description: "Login SNS token success",
            },
        },
    })
    async userLoginSns(req: Request, res: Response) {
        const loginSnsRequest = new LoginSNSRequest({
            ...req.body,
            ipv4: req.ipv4!,
        });
        const result = await this.service.userLoginSns(loginSnsRequest);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/admin/register",
        operationId: "adminRegister",
        description: "Admin register account",
        summary: "Admin register account",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: RegisterInAppRequest },
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
                description: "Register token success",
            },
        },
    })
    async adminRegisterAccount(req: Request, res: Response) {
        const registerInAppRequest = new RegisterInAppRequest({
            ...req.body,
            ipv4: req.ipv4,
        });
        const result = await this.service.adminRegisterAccount(
            registerInAppRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/admin/login",
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
        path: "/admin/info",
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
        path: "/admin/renew-token",
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
