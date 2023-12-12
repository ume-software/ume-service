import { BookingComplaintPagingResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingComplaintService } from "@/services";
import { BookingComplaintService } from "@/services/api/v1/bookingComplaint.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/admin/booking-complaint",
    name: "AdminManageBookingComplaint",
})
export class AdminManageBookingComplaintController extends BaseController {
    constructor() {
        super();
        this.service = bookingComplaintService;
        this.path = "booking-complaint";
        this.customRouting();
    }
    service: BookingComplaintService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetBookingComplaintHistory)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "adminGetBookingComplaintHistory",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get booking complaint history",
        summary: "Admin get booking complaint history",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingComplaintPagingResponse },
                    },
                },
                description: "Admin get booking complaint history",
            },
        },
    })
    async adminGetBookingComplaintHistory(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
}
