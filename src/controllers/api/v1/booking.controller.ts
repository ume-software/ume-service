import {
    BookingProviderRequest,
    FeedbackBookingRequest,
    BookingHandleRequest,
} from "@/common/requests";
import {
    BookingHistoryPagingResponse,
    BookingHistoryResponse,
    EstimateHistoryResponse,
    FeedbackResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingService, errorService, feedbackService } from "@/services";
import { BookingService } from "@/services/api/v1/booking.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { queryParameters } from "@/swagger/parameters/query.parameter";

import {
    ApiOperationGet,
    ApiOperationPost,
    ApiOperationPut,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/booking",
    name: "booking",
})
export class BookingController extends BaseController {
    constructor() {
        super();
        this.service = bookingService;
        this.path = "booking";
        this.customRouting();
    }
    private service: BookingService;

    customRouting() {
        this.router.get(
            "/pending-booking-provider",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getPendingBookingForProvider)
        );
        this.router.get(
            "/pending-booking-user",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getPendingBookingForUser)
        );
        this.router.get(
            "/current-booking-provider",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getCurrentBookingForProvider)
        );

        this.router.get(
            "/current-booking-user",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getCurrentBookingForUser)
        );
        this.router.get(
            "/booker-history",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.bookerGetBookingHistory)
        );
        this.router.get(
            "/provider-history",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerGetBookingHistory)
        );
        this.router.get(
            "/:slug/current-booking",
            this.route(this.getCurrentBookingByUserSlug)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createBooking)
        );
        this.router.post(
            "/estimate",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.estimateBooking)
        );
        this.router.post(
            "/:id/feedback",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createFeedbackBooking)
        );
        this.router.put(
            "/handle",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.bookingHandle)
        );
    }

    @ApiOperationGet({
        path: "/pending-booking-provider",
        operationId: "getPendingBookingForProvider",
        security: {
            bearerAuth: [],
        },
        description: "Get pending booking for provider",
        summary: "Get pending booking for provider",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Get pending booking for provider success",
            },
        },
    })
    async getPendingBookingForProvider(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getPendingBookingForProvider(userId);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/pending-booking-user",
        operationId: "getPendingBookingForUser",
        security: {
            bearerAuth: [],
        },
        description: "Get pending booking for user",
        summary: "Get pending booking for user",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Get pending booking for user success",
            },
        },
    })
    async getPendingBookingForUser(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getPendingBookingForUser(userId);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/current-booking-provider",
        operationId: "getCurrentBookingForProvider",
        security: {
            bearerAuth: [],
        },
        description: "Get current booking for provider",
        summary: "Get current booking for provider",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Get current booking for provider success",
            },
        },
    })
    async getCurrentBookingForProvider(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getCurrentBookingForProvider(userId);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/current-booking-user",
        operationId: "getCurrentBookingForUser",
        security: {
            bearerAuth: [],
        },

        description: "Get current booking for user",
        summary: "Get current booking for user",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Get current booking for user success",
            },
        },
    })
    async getCurrentBookingForUser(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getCurrentBookingForUser(userId);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/booker-history",
        operationId: "bookerGetBookingHistory",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Booker get booking history",
        summary: "Booker get booking history",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Booker get booking history success",
            },
        },
    })
    async bookerGetBookingHistory(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.bookerId", userId);
        _.set(queryInfoPrisma, "include", {
            providerService: {
                include: {
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            avatarUrl: true,
                        },
                    },
                    service: true,
                },
            },
        });
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/provider-history",
        operationId: "providerGetBookingHistory",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Provider get booking history",
        summary: "Provider get booking history",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Provider get booking history success",
            },
        },
    })
    async providerGetBookingHistory(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};

        _.set(queryInfoPrisma, "where.providerService.providerId", userId);

        _.set(queryInfoPrisma, "include", {
            providerService: {
                include: {
                    service: true,
                },
            },
            booker: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    avatarUrl: true,
                },
            },
        });
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/current-booking",
        operationId: "getCurrentBookingByUserSlug",
        description: "Get current booking by user",
        summary: "Get current booking by user",
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
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Get current booking for provider success",
            },
        },
    })
    async getCurrentBookingByUserSlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const result = await this.service.getCurrentBookingByUserSlug(slug);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createBooking",
        security: {
            bearerAuth: [],
        },
        description: "Create new booking",
        summary: "Create new booking",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: BookingProviderRequest },
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
                description: "Create new booking success",
            },
        },
    })
    async createBooking(req: Request, res: Response) {
        const result = await this.service.userBookingProvider(req);
        this.onSuccess(res, result);
    }
    @ApiOperationPost({
        path: "/estimate",
        operationId: "estimateBooking",
        security: {
            bearerAuth: [],
        },
        description: "Create new booking",
        summary: "Create new booking",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: BookingProviderRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: EstimateHistoryResponse },
                    },
                },
                description: "Create new booking success",
            },
        },
    })
    async estimateBooking(req: Request, res: Response) {
        const bookingProviderRequest = new BookingProviderRequest(req.body);
        const bookerId = this.getTokenInfo(req).id;

        const result = await this.service.estimateBookingProvider(
            bookerId,
            bookingProviderRequest
        );
        this.onSuccess(res, result);
    }
    @ApiOperationPost({
        path: "/{id}/feedback",
        operationId: "createFeedbackBooking",
        security: {
            bearerAuth: [],
        },
        description: "Create feedback",
        summary: "Create feedback",
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
                    schema: { model: FeedbackBookingRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: FeedbackResponse },
                    },
                },
                description: "Create feedback success",
            },
        },
    })
    async createFeedbackBooking(req: Request, res: Response) {
        const { id: bookingId } = req.params;
        const userId = this.getTokenInfo(req).id;
        if (!bookingId) {
            throw errorService.error(ERROR_MESSAGE.BAD_REQUEST);
        }
        const feedbackBookingRequest = new FeedbackBookingRequest(req.body);
        feedbackBookingRequest.bookerId = userId;
        feedbackBookingRequest.bookingId = bookingId;

        const result = await feedbackService.create(feedbackBookingRequest);
        this.onSuccess(res, result);
    }
    @ApiOperationPut({
        path: "/handle",
        operationId: "bookingHandle",
        security: {
            bearerAuth: [],
        },
        description: "Booing handle",
        summary: "Booing handle",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: BookingHandleRequest },
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
                description: "Booing handle success",
            },
        },
    })
    async bookingHandle(req: Request, res: Response) {
        const result = await this.service.bookingHandle(req);
        this.onSuccess(res, result);
    }
}
