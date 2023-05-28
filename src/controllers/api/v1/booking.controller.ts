import { BookingHandleRequest } from "@/common/requests/bookingHandle.request";
import { BookingProviderRequest } from "@/common/requests/bookingProvider.request";
import { BookingHistoryResponse } from "@/common/responses/bookingHistory.reponse";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingService } from "@/services";
import { BookingService } from "@/services/api/v1/booking.service";
import {
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
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createbooking)
        );
        this.router.put(
            "/handle",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.bookingHandle)
        );
    }

    @ApiOperationPost({
        path: "",
        operationId: "createbooking",
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
    async createbooking(req: Request, res: Response) {
        const bookingRequest = req.body as BookingProviderRequest;
        const userId = req.tokenInfo?.id;
        const result = await this.service.userBookingProvider(
            userId!!,
            bookingRequest
        );
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
        const bookingHandle = req.body as BookingHandleRequest;
        const userId = req.tokenInfo?.id;
        const result = await this.service.bookingHandle(
            userId!!,
            bookingHandle
        );
        this.onSuccess(res, result);
    }
}
