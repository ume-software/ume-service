import { AdminHandleBookingComplaintRequest } from "@/common/requests";
import { BookingComplaintPagingResponse } from "@/common/responses";
import { BookingComplaintResponseResponse } from "@/common/responses/bookingComplaint/bookingComplaintResponse.response";
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
    ApiOperationPost,
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
            this.route(this.adminGetAllBookingComplaintHistory)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetBookingComplaintHistoryById)
        );
        this.router.post(
            "/:id/handle",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminHandleBookingComplaintHistoryById)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "adminGetAllBookingComplaintHistory",
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
    async adminGetAllBookingComplaintHistory(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetBookingComplaintHistoryById",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
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
    async adminGetBookingComplaintHistoryById(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        if (!queryInfoPrisma.where.id) queryInfoPrisma.where.id = id;
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/{id}",
        operationId: "adminHandleBookingComplaintHistoryById",
        security: {
            bearerAuth: [],
        },
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
        description: "Admin get booking complaint history",
        summary: "Admin get booking complaint history",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: AdminHandleBookingComplaintRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingComplaintResponseResponse },
                    },
                },
                description: "Admin get booking complaint history",
            },
        },
    })
    async adminHandleBookingComplaintHistoryById(req: Request, res: Response) {
        const { id } = req.params;
        const adminHandleBookingComplaintRequest =
            new AdminHandleBookingComplaintRequest({
                ...req.body,
                id,
            });
        const result = await this.service.adminHandleBookingComplaintHistory(adminHandleBookingComplaintRequest);
        this.onSuccess(res, result);
    }
}
