import { BookingHandleRequest } from "@/common/requests/bookingHandle.request";
import { BookingProviderRequest } from "@/common/requests/bookingProvider.request";
import { FeedbackBookingRequest } from "@/common/requests/feedbackBooking.request";
import { BookingHistoryResponse } from "@/common/responses/bookingHistory.reponse";
import { BookingHistoryPagingResponse } from "@/common/responses/bookingHistoryPaging.response";
import { FeedbackResponse } from "@/common/responses/feedback.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingService, errorService, feedbackService } from "@/services";
import { BookingService } from "@/services/api/v1/booking.service";

import {
    ApiOperationGet,
    ApiOperationPost,
    ApiOperationPut,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

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
    service: BookingService;

    customRouting() {
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
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createBooking)
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
        const userId = req.tokenInfo?.id;
        if (!userId) {
            throw errorService.auth.badToken();
        }
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
        const userId = req.tokenInfo?.id;
        if (!userId) {
            throw errorService.auth.badToken();
        }
        const result = await this.service.getCurrentBookingForUser(userId);
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
        const { id: bookingId } = req.params
        const userId = req.tokenInfo?.id;
        const feedbackBookingRequest = { ...req.body, bookingId, bookerId: userId } as FeedbackBookingRequest;

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
