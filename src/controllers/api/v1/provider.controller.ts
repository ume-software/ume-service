import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import {
    FilterProviderPagingResponse,
} from "@/common/responses";

import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { providerService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";
import {
    filterHotProviderParameters,
    filterProviderParameters,
    limitParameter,
    orderParameter,
    pageParameter,
    queryParameters,
} from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/provider",
    name: "Provider",
})
export class ProviderController extends BaseController {
    constructor() {
        super();
        this.service = providerService;
        this.path = "provider";
        this.customRouting();
    }
    service: ProviderService;

    customRouting() {
        this.router.get("/", this.route(this.getListProvider));
        this.router.get("/hot", this.route(this.getListHotProvider));
    }
    @ApiOperationGet({
        path: "",
        operationId: "getListProvider",
        description: "Get list provider",
        summary: "Get list provider",
        parameters: {
            query: {
                ...filterProviderParameters,
                ...limitParameter,
                ...pageParameter,
                ...orderParameter,
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: FilterProviderPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getListProvider(req: Request, res: Response) {
        const { queryInfoPrisma } = req;
        const { "service-id": serviceId, gender, name, status } = req.query;
        const start_cost = req.query["start-cost"]?.toString();
        const startCost = start_cost ? +start_cost : undefined;
        const end_cost = req.query["end-cost"]?.toString();
        const endCost = end_cost ? +end_cost : undefined;
        const result = await this.service.filterProvider(
            {
                startCost,
                endCost,
                serviceId: serviceId?.toString() || undefined,
                name,
                gender,
                status,
                order: queryInfoPrisma?.orderBy,
            } as IOptionFilterProvider,
            queryInfoPrisma!
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/hot",
        operationId: "getListHotProvider",
        description: "Get List Hot Providerr",
        summary: "Get List Hot Providerr",
        parameters: {
            query: {
                ...filterHotProviderParameters,
                ...queryParameters,
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: FilterProviderPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getListHotProvider(req: Request, res: Response) {
        const { queryInfoPrisma } = req;
        let { interval_days } = req.query;

        const result = await this.service.filterHotProvider(
            {
                intervalDays: +(interval_days || 7),
            } as IOptionFilterHotProvider,
            queryInfoPrisma!
        );
        this.onSuccessAsList(res, result);
    }
}
