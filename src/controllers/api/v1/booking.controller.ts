import { BookingProviderRequest } from "@/common/requests/bookingProvider.request";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingService } from "@/services";
import { BookingService } from "@/services/api/v1/booking.service";
import { hostLanguageParameter } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationPost,
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
    }

    @ApiOperationPost({
        path: "",
        operationId: "createbooking",
        security: {
            bearerAuth: [],
        },
        description: "Register become booking",
        summary: "Register become booking",
        parameters: {
            query: hostLanguageParameter,
        },
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
                        schema: { model: BookingProviderRequest },
                    },
                },
                description: "Register success",
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
}
