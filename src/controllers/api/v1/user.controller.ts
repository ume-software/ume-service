import { UpdateUserProfileRequest, UserSendKYCRequest } from "@/common/requests";
import {
    AlbumPagingResponse,
    PostPagingResponse,
    UserInformationResponse,
} from "@/common/responses";
import { UserKYCRequestResponse } from "@/common/responses/kycRequest";

import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, userService } from "@/services";
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
            "/kyc-request",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userSendKYCRequest)
        );
        this.router.get("/:slug/album", this.route(this.getAlbumByUserSlug));
        this.router.get("/:slug/posts", this.route(this.getPostsByUserSlug));
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
}
