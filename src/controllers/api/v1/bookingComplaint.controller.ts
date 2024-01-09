import { CreateBookingComplaintRequest } from "@/common/requests";
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
import { BookingComplaintResponseType } from "@prisma/client";
import {
    ApiOperationGet,
    ApiOperationPost,
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
        this.path = "booking-complaint";
        this.customRouting();
    }
    private service: BookingComplaintService;
    customRouting() {
        this.router.get(
            "/booker-history",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.bookerGetBookingComplaintHistory)
        );
        this.router.get(
            "/provider-history",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerGetBookingComplaintHistory)
        );
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createBookingComplaint)
        );
    }
    @ApiOperationGet({
        path: "/booker-history",
        operationId: "bookerGetBookingComplaintHistory",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Booker get booking complaint history",
        summary: "Booker get booking complaint history",
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
    async bookerGetBookingComplaintHistory(req: Request, res: Response) {
        const bookerId = this.getTokenInfo(req).id;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.booking.bookerId", bookerId);
        _.set(queryInfoPrisma, "include", {
            booking: {
                include: {
                    booker: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            avatarUrl: true,
                        },
                    },
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
                },
            },
            bookingComplaintResponses: {
                where: {
                    deletedAt: null,
                    bookingComplaintResponseType: {
                        in: [
                            BookingComplaintResponseType.ADMIN_SEND_TO_BOOKER,
                            BookingComplaintResponseType.PROVIDER_SEND_TO_ADMIN,
                        ],
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        });

        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/provider-history",
        operationId: "providerGetBookingComplaintHistory",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Provider get booking complaint history",
        summary: "Provider get booking complaint history",
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
    async providerGetBookingComplaintHistory(req: Request, res: Response) {
        const providerId = this.getTokenInfo(req).id;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(
            queryInfoPrisma,
            "where.booking.providerService.providerId",
            providerId
        );

        _.set(queryInfoPrisma, "include", {
            booking: {
                include: {
                    booker: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            avatarUrl: true,
                        },
                    },
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
                },
            },
            bookingComplaintResponses: {
                where: {
                    deletedAt: null,
                    bookingComplaintResponseType: {
                        in: [
                            BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER,
                            BookingComplaintResponseType.PROVIDER_SEND_TO_ADMIN,
                        ],
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        });

        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationPost({
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
                        schema: { model: BookingComplaintPagingResponse },
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
