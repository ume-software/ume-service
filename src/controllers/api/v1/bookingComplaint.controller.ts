import { CreateBookingComplaintRequest } from "@/common/requests/bookingComplaint/createBookingComplaint.request";
import { DepositPagingResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingComplaintService } from "@/services";
import { BookingComplaintService } from "@/services/api/v1/bookingComplaint.service";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/booking-complaint",
    name: "BookingComplaint",
})
export class BookingComplaintController extends BaseController {
    constructor() {
        super();
        this.service = bookingComplaintService;
        this.path = "bookingComplaint";
        this.customRouting();
    }
    service: BookingComplaintService;
    customRouting() {
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createBookingComplaint)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "createBookingComplaint",
        security: {
            bearerAuth: [],
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateBookingComplaintRequest },
                },
            },
        },
        description: "Create booking complaint request",
        summary: "Create booking complaint request",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositPagingResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async createBookingComplaint(req: Request, res: Response) {
        const createBookingComplaintRequest = new CreateBookingComplaintRequest(
            {
                bookerId: this.getTokenInfo(req).id,
                ...req.body,
            }
        );
        const result = await this.service.create(createBookingComplaintRequest);
        this.onSuccess(res, result);
    }
}
