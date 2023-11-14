import {
    AdminGetTotalUserResponse,
    BaseSingleChartStatisticResponse,
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
            this.route(this.getGetNewUserStatistic)
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
            "/total-user",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetTotalProvider)
        );
    }

    @ApiOperationGet({
        path: "/new-user",
        operationId: "getGetNewUserStatistic",
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
                        schema: { model: BaseSingleChartStatisticResponse },
                    },
                },
                description: "Admin get new user statistic success",
            },
        },
    })
    async getGetNewUserStatistic(req: Request, res: Response) {
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
                        schema: { model: BaseSingleChartStatisticResponse },
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
}
