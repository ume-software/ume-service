import { BuyCoinPagingResponse, BuyCoinResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { bannerService } from "@/services";
import { BannerService } from "@/services/api/v1/banner.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/banner",
    name: "Banner",
})
export class BannerController extends BaseController {
    constructor() {
        super();
        this.service = bannerService;
        this.path = "banner";
        this.customRouting();
    }
    service: BannerService;
    customRouting() {
        this.router.get("", this.route(this.getListBanner));
        this.router.get("/:id", this.route(this.getOneBanner));
    }

    @ApiOperationGet({
        path: "",
        operationId: "getListBanner",
        parameters: {
            query: queryParameters,
        },
        description: "User get list banner",
        summary: "User get list banner",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BuyCoinPagingResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async getListBanner(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "getOneBanner",
        description: "User get one withdraw request",
        summary: "User get one withdraw request",
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
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BuyCoinResponse },
                    },
                },
                description: "User get one banner",
            },
        },
    })
    async getOneBanner(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
