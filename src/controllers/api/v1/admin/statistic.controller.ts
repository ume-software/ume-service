import {
    AdminGetTotalDepositWithdrawalResponse,
    AdminGetTotalUserResponse,
    BaseSingleChartStatisticResponse,
    BaseSingleChartTimeStatisticResponse,
} from "@/common/responses";
import { AdminGetTotalProviderResponse } from "@/common/responses/statistic/adminGetTotalProvider.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";
import { statisticService } from "@/services";
import { StatisticService } from "@/services/api/v1/statistic.service";
import { intervalStatisticParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/admin/statistic",
    name: "AdminManageStatistic",
})
export class AdminManageStatisticController extends BaseController {
    constructor() {
        super();
        this.service = statisticService;
        this.path = "statistic";
        this.customRouting();
    }
    service: StatisticService;
    customRouting() {
        this.router.get(
            "/new-user",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetNewUserStatistic)
        );
        this.router.get(
            "/new-provider",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetNewProviderStatistic)
        );
        this.router.get(
            "/total-user",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetTotalUser)
        );
        this.router.get(
            "/total-provider",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetTotalProvider)
        );
        this.router.get(
            "/provider-service-most-used",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetMostProviderServicesStatistics)
        );
        this.router.get(
            "/most-booking-service",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetMostBookingServicesStatistics)
        );
        this.router.get(
            "/total-deposit-withdrawal",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetTotalDepositWithdrawal)
        );

        this.router.get(
            "/deposit",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetAmountMoneyDepositStatistics)
        );
        this.router.get(
            "/withdrawal",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetAmountMoneyWithdrawalStatistics)
        );
    }

    @ApiOperationGet({
        path: "/new-user",
        operationId: "adminGetNewUserStatistic",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: intervalStatisticParameters,
        },
        description: "Admin get new user statistic",
        summary: "Admin get new user statistic",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BaseSingleChartTimeStatisticResponse },
                    },
                },
                description: "Admin get new user statistic success",
            },
        },
    })
    async adminGetNewUserStatistic(req: Request, res: Response) {
        const { time, unit, "gap-unit": gapUnit } = req.query;
        const data = await this.service.newUserStatistics(
            time ? Number.parseInt(time as string) : undefined,
            unit as EIntervalUnit,
            gapUnit as EIntervalUnit
        );
        this.onSuccess(res, { data });
    }

    @ApiOperationGet({
        path: "/new-provider",
        operationId: "adminGetNewProviderStatistic",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: intervalStatisticParameters,
        },
        description: "Admin get new provider statistic",
        summary: "Admin get new provider statistic",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BaseSingleChartTimeStatisticResponse },
                    },
                },
                description: "Admin get new provider statistic success",
            },
        },
    })
    async adminGetNewProviderStatistic(req: Request, res: Response) {
        const { time, unit, "gap-unit": gapUnit } = req.query;
        const data = await this.service.newProviderStatistics(
            time ? Number.parseInt(time as string) : undefined,
            unit as EIntervalUnit,
            gapUnit as EIntervalUnit
        );
        this.onSuccess(res, { data });
    }
    @ApiOperationGet({
        path: "/total-user",
        operationId: "adminGetTotalUser",
        security: {
            bearerAuth: [],
        },

        description: "Admin get new provider statistic",
        summary: "Admin get new provider statistic",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetTotalUserResponse },
                    },
                },
                description: "Admin get new provider statistic success",
            },
        },
    })
    async adminGetTotalUser(_req: Request, res: Response) {
        const result = await this.service.getTotalUser();
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/total-provider",
        operationId: "adminGetTotalProvider",
        security: {
            bearerAuth: [],
        },
        description: "Admin get new provider statistic",
        summary: "Admin get new provider statistic",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetTotalProviderResponse },
                    },
                },
                description: "Admin get new provider statistic success",
            },
        },
    })
    async adminGetTotalProvider(_req: Request, res: Response) {
        const result = await this.service.getTotalProvider();
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/provider-service-most-used",
        operationId: "adminGetMostProviderServicesStatistics",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                top: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
                    },
                },
            },
        },
        description: "Admin get most provider services statistics",
        summary: "Admin get most provider services statistics",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BaseSingleChartStatisticResponse },
                    },
                },
                description:
                    "Admin get most provider services statistics success",
            },
        },
    })
    async adminGetMostProviderServicesStatistics(req: Request, res: Response) {
        let { top } = req.params;
        if (!top) top = "10";
        const data = await this.service.getMostProviderServicesStatistics(+top);
        this.onSuccess(res, { data });
    }

    @ApiOperationGet({
        path: "/most-booking-service",
        operationId: "adminGetMostBookingServicesStatistics",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                top: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
                    },
                },
            },
        },
        description: "Admin get most provider services statistics",
        summary: "Admin get most provider services statistics",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BaseSingleChartStatisticResponse },
                    },
                },
                description:
                    "Admin get most provider services statistics success",
            },
        },
    })
    async adminGetMostBookingServicesStatistics(req: Request, res: Response) {
        let { top } = req.params;
        if (!top) top = "10";
        const data = await this.service.getMostBookingServicesStatistics(+top);
        this.onSuccess(res, { data });
    }
    @ApiOperationGet({
        path: "/total-deposit-withdrawal",
        operationId: "adminGetTotalDepositWithdrawal",
        security: {
            bearerAuth: [],
        },
        description: "Admin get total deposit and withdrawal",
        summary: "Admin get total deposit and withdrawal",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: {
                            model: AdminGetTotalDepositWithdrawalResponse,
                        },
                    },
                },
                description: "Admin get total deposit and withdrawal success",
            },
        },
    })
    async adminGetTotalDepositWithdrawal(_req: Request, res: Response) {
        const data = await this.service.adminGetTotalDepositWithdrawal();
        this.onSuccess(res, { data });
    }

    @ApiOperationGet({
        path: "/deposit",
        operationId: "adminGetAmountMoneyDepositStatistics",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: intervalStatisticParameters,
        },
        description: "Admin get new provider statistic",
        summary: "Admin get new provider statistic",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BaseSingleChartTimeStatisticResponse },
                    },
                },
                description: "Admin get new provider statistic success",
            },
        },
    })
    async adminGetAmountMoneyDepositStatistics(req: Request, res: Response) {
        const { time, unit, "gap-unit": gapUnit } = req.query;
        const data = await this.service.amountMoneyDepositStatistics(
            time ? Number.parseInt(time as string) : undefined,
            unit as EIntervalUnit,
            gapUnit as EIntervalUnit
        );
        this.onSuccess(res, data);
    }

    @ApiOperationGet({
        path: "/withdrawal",
        operationId: "adminGetAmountMoneyWithdrawalStatistics",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: intervalStatisticParameters,
        },
        description: "Admin get new provider statistic",
        summary: "Admin get new provider statistic",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BaseSingleChartTimeStatisticResponse },
                    },
                },
                description: "Admin get new provider statistic success",
            },
        },
    })
    async adminGetAmountMoneyWithdrawalStatistics(req: Request, res: Response) {
        const { time, unit, "gap-unit": gapUnit } = req.query;
        const data = await this.service.amountMoneyWithdrawalStatistics(
            time ? Number.parseInt(time as string) : undefined,
            unit as EIntervalUnit,
            gapUnit as EIntervalUnit
        );
        this.onSuccess(res, { data });
    }
}
