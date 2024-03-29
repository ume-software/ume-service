import {
    BookingHistoryPagingResponse,
    BookingHistoryResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { bookingService } from "@/services";
import { BookingService } from "@/services/api/v1/booking.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/admin/booking",
    name: "AdminManageBooking",
})
export class AdminManageBookingController extends BaseController {
    constructor() {
        super();
        this.service = bookingService;
        this.path = "booking";
        this.customRouting();
    }
    private service: BookingService;
    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListBookingHistory)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetBookingHistoryById)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListBookingHistory",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Get all booking",
        summary: "Get all booking",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryPagingResponse },
                    },
                },
                description: "Get all booking success",
            },
        },
    })
    async adminGetListBookingHistory(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetBookingHistoryById",
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
        description: "Get all booking",
        summary: "Get all booking",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BookingHistoryResponse },
                    },
                },
                description: "Get all booking success",
            },
        },
    })
    async adminGetBookingHistoryById(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        if (!queryInfoPrisma.where.id) queryInfoPrisma.where.id = id;

        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
}
