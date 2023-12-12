import { CreateBookingComplaintResponseRequest } from "@/common/requests";
import { BookingComplaintPagingResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingComplaintResponseService } from "@/services";
import { BookingComplaintResponseService } from "@/services/api/v1/bookingComplaintResponse.service";
import {
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/booking-complaint-response",
    name: "BookingComplaintResponse",
})
export class BookingComplaintResponseController extends BaseController {
    constructor() {
        super();
        this.service = bookingComplaintResponseService;
        this.path = "booking-complaint-response";
        this.customRouting();
    }
    service: BookingComplaintResponseService;
    customRouting() {
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerCreateBookingComplaintResponse)
        );
    }
    @ApiOperationPost({
        path: "",
        operationId: "providerCreateBookingComplaintResponse",
        security: {
            bearerAuth: [],
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateBookingComplaintResponseRequest },
                },
            },
        },
        description: "Create booking complaint request",
        summary: "Create booking complaint request",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingComplaintPagingResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async providerCreateBookingComplaintResponse(req: Request, res: Response) {
        const createBookingComplaintResponseRequest =
            new CreateBookingComplaintResponseRequest({
                requesterId: this.getTokenInfo(req).id,
                ...req.body,
            });
        const result =
            await this.service.providerCreateBookingComplaintResponse(
                createBookingComplaintResponseRequest
            );
        this.onSuccess(res, result);
    }
}
