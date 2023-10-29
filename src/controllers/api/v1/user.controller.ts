import {
    CreateReportUserRequest,
    UpdateProviderProfileRequest,
    UpdateUserProfileRequest,
    UserSendKYCRequest,
} from "@/common/requests";
import {
    AlbumPagingResponse,
    CheckExistedResponse,
    PostPagingResponse,
    UserInformationResponse,
} from "@/common/responses";
import { UserKYCRequestResponse } from "@/common/responses/kycRequest";
import { ProviderConfigResponse } from "@/common/responses/providerConfig";
import { ReportUserResponse } from "@/common/responses/reportUser";

import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import {
    errorService,
    providerService,
    reportUserService,
    userService,
} from "@/services";
import { UserService } from "@/services/api/v1/user.service";
import {
    limitParameter,
    pageParameter,
} from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/user",
    name: "User",
})
export class UserController extends BaseController {
    constructor() {
        super();
        this.service = userService;
        this.path = "user";
        this.customRouting();
    }
    service: UserService;

    customRouting() {
        this.router.get("/:slug", this.route(this.getUserBySlug));
        this.router.get("/:slug/album", this.route(this.getAlbumByUserSlug));
        this.router.get("/:slug/posts", this.route(this.getPostsByUserSlug));
        this.router.get(
            "/check-slug/:slug",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.checkSlugUserExisted)
        );
        this.router.patch(
            "/profile",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.updateUserProfile)
        );
        this.router.post(
            "/verification-request",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userVerificationRequest)
        );
        this.router.post(
            "/:slug/report",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.reportUserBySlug)
        );
        this.router.post(
            "/kyc-request",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userSendKYCRequest)
        );
        this.router.post(
            "/become-provider",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userBecomeProvider)
        );
        this.router.patch(
            "/provider-profile",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userUpdateProviderProfile)
        );
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "getUserBySlug",
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
        },
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
    async getUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const result = await userService.getUserBySlug(slug);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/profile",
        operationId: "updateUserProfile",
        security: {
            bearerAuth: [],
        },
        description: "Update user profile",
        summary: "Update user profile",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateUserProfileRequest },
                },
            },
            description: "Update user profile request",
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async updateUserProfile(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const updateUserProfileRequest = new UpdateUserProfileRequest(req.body);
        if (!userId) {
            throw errorService.badToken();
        }
        const result = await userService.updateUserProfile(
            userId,
            updateUserProfileRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/verification-request",
        operationId: "userVerificationRequest",
        security: {
            bearerAuth: [],
        },
        description: "User create verification request",
        summary: "User create verification request",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateUserProfileRequest },
                },
            },
            description: "User create verification request request",
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async userVerificationRequest(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const updateUserProfileRequest = new UpdateUserProfileRequest(req.body);
        if (!userId) {
            throw errorService.badToken();
        }
        const result = await userService.updateUserProfile(
            userId,
            updateUserProfileRequest
        );
        this.onSuccess(res, result);
    }
    @ApiOperationPost({
        path: "/{slug}/report",
        operationId: "reportUserBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Report user by slug",
        summary: "Report user by slug",
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
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateReportUserRequest },
                },
            },
            description: "Report user by slug request",
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ReportUserResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async reportUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const userId = this.getTokenInfo(req).id;
        const updateUserProfileRequest = new CreateReportUserRequest({
            ...req.body,
            reportedUserSlug: slug,
        });
        if (!userId) {
            throw errorService.badToken();
        }
        const result = await reportUserService.create(
            userId,
            updateUserProfileRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/kyc-request",
        operationId: "userSendKYCRequest",
        security: {
            bearerAuth: [],
        },
        description: "User create verification request",
        summary: "User create verification request",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UserSendKYCRequest },
                },
            },
            description: "User create verification request request",
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserKYCRequestResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async userSendKYCRequest(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const userKYCRequest = new UserSendKYCRequest(req.body);
        if (!userId) {
            throw errorService.badToken();
        }
        const result = await userService.userSendKYCRequest(
            userId,
            userKYCRequest
        );
        this.onSuccess(res, result);
    }
    @ApiOperationPost({
        path: "/become-provider",
        operationId: "userBecomeProvider",
        security: {
            bearerAuth: [],
        },
        description: "Become provider",
        summary: "Become provider",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async userBecomeProvider(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await userService.userBecomeProvider(userId);
        this.onSuccess(res, result);
    }
    @ApiOperationPatch({
        path: "/update-provider-profile",
        operationId: "userUpdateProviderProfile",
        security: {
            bearerAuth: [],
        },
        description: "Update provider profile",
        summary: "Update provider profile",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateProviderProfileRequest },
                },
            },
        },

        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProviderConfigResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async userUpdateProviderProfile(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const updateProviderProfileRequest = new UpdateProviderProfileRequest({
            ...req.body,
            userId,
        });
        const result = await providerService.updateProviderProfile(
            updateProviderProfileRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/album",
        operationId: "getAlbumByUserSlug",
        description: "Get User by slug or id",
        summary: "Get User by slug or id",
        parameters: {
            query: {
                ...limitParameter,
                ...pageParameter,
            },

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
                        schema: { model: AlbumPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getAlbumByUserSlug(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const { slug } = req.params;
        const result = await this.service.getAlbumByUserSlug(
            slug!,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/posts",
        operationId: "getPostsByUserSlug",
        description: "Get User by slug or id",
        summary: "Get User by slug or id",
        parameters: {
            query: {
                ...limitParameter,
                ...pageParameter,
            },

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
                        schema: { model: PostPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getPostsByUserSlug(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const { slug } = req.params;
        const result = await this.service.getPostsByUserSlug(
            slug!,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/check-slug/{slug}",
        operationId: "checkSlugUserExisted",
        security: {
            bearerAuth: [],
        },
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
        description: "Check Voucher Code",
        summary: "Check Voucher Code",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: CheckExistedResponse },
                    },
                },
                description: "Check voucher slug success",
            },
        },
    })
    async checkSlugUserExisted(req: Request, res: Response) {
        const { slug } = req.params;
        const isExisted = await this.service.checkSlugUserExisted(slug!);
        this.onSuccess(res, { isExisted });
    }
}
