import {
    CreateReportUserRequest,
    UpdateProviderProfileRequest,
    UpdateUserProfileRequest,
    UserSendKYCRequest,
} from "@/common/requests";
import {
    AlbumPagingResponse,
    BookingHistoryResponse,
    CheckExistedResponse,
    FeedbackPagingResponse,
    FollowResponse,
    PostPagingResponse,
    UserInformationResponse,
    UserKYCRequestResponse,
    ProviderConfigResponse,
    ReportUserResponse,
    UserInformationPagingResponse,
} from "@/common/responses";

import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import {
    errorService,
    followService,
    providerService,
    reportUserService,
    userService,
} from "@/services";
import { UserService } from "@/services/api/v1/user.service";
import {
    limitParameter,
    pageParameter,
    queryParameters,
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
    private service: UserService;

    customRouting() {
        this.router.get(
            "/:slug",
            this.authOrUnAuthMiddlewares(),
            this.route(this.getUserBySlug)
        );
        this.router.get(
            "/:slug/follower",
            this.route(this.getFollowerByUserSlug)
        );
        this.router.get(
            "/:slug/following",
            this.route(this.getFollowingByUserSlug)
        );
        this.router.get("/:slug/album", this.route(this.getAlbumByUserSlug));
        this.router.get(
            "/:slug/feedback",
            this.route(this.getFeedbackByUserSlug)
        );
        this.router.get("/:slug/posts", this.route(this.getPostsByUserSlug));
        this.router.get(
            "/:slug/booking-can-feedback",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getBookingCanFeedbackByUserSlug)
        );
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
            "/:slug/follow",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.followUserBySlug)
        );
        this.router.post(
            "/:slug/un-follow",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.unFollowUserBySlug)
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
            "/update-provider-profile",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userUpdateProviderProfile)
        );
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "getUserBySlug",
        security: {
            bearerAuth: [],
        },
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
        const userId = req.tokenInfo?.id;
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const result = await userService.getUserBySlug(slug, userId);
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
        path: "/{slug}/follow",
        operationId: "followUserBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Follow user by slug",
        summary: "Follow user by slug",
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
                        schema: { model: FollowResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async followUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const userId = this.getTokenInfo(req).id;

        const result = await followService.create(userId, slug);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/{slug}/un-follow",
        operationId: "unFollowUserBySlug",
        security: {
            bearerAuth: [],
        },
        description: "Un-follow user by slug",
        summary: "Un-follow user by slug",
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
                        schema: { model: FollowResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async unFollowUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const userId = this.getTokenInfo(req).id;

        const result = await followService.unFollow(userId, slug);
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
        path: "/{slug}/follower",
        operationId: "getFollowerByUserSlug",
        description: "Get follower by user slug",
        summary: "Get follower by user slug",
        parameters: {
            query: queryParameters,

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
                        schema: { model: UserInformationPagingResponse },
                    },
                },
                description: "Follower response",
            },
        },
    })
    async getFollowerByUserSlug(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const { slug } = req.params;
        const result = await this.service.getFollowerByUserSlug(
            slug!,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/following",
        operationId: "getFollowingByUserSlug",
        description: "Get following by user slug",
        summary: "Get following by user slug",
        parameters: {
            query: queryParameters,

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
                        schema: { model: UserInformationPagingResponse },
                    },
                },
                description: "Following response",
            },
        },
    })
    async getFollowingByUserSlug(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const { slug } = req.params;
        const result = await this.service.getFollowingByUserSlug(
            slug!,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
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
        path: "/{slug}/feedback",
        operationId: "getFeedbackByUserSlug",
        description: "Get feedback user by slug or id",
        summary: "Get feedback user by slug or id",
        parameters: {
            query: queryParameters,

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
                        schema: { model: FeedbackPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getFeedbackByUserSlug(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const { slug } = req.params;
        const result = await this.service.getFeedbackByUserSlug(
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
        path: "/{slug}/booking-can-feedback",
        operationId: "getBookingCanFeedbackByUserSlug",
        description: "Get booking can feedback by slug or id of user",
        summary: "Get booking can feedback by slug or id of user",
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
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getBookingCanFeedbackByUserSlug(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const { slug } = req.params;
        const result = await this.service.getBookingCanFeedbackByUserSlug(
            slug!,
            userId
        );
        this.onSuccess(res, result);
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
