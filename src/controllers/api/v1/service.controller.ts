import { ServiceResponse } from "@/common/responses";
import { ServicePagingResponse } from "@/common/responses/service/servicePaging.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { serviceService } from "@/services";
import { ServiceService } from "@/services/api/v1/service.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import { MappingErrorResponseSwaggerApi } from "@/swagger/swagger.helper";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/service",
    name: "Service",
})
export class ServiceController extends BaseController {
    constructor() {
        super();
        this.service = serviceService;
        this.path = "service";
        this.customRouting();
    }

    customRouting() {
        this.router.get("/", this.route(this.findAndCountAll));
        this.router.get("/:slug", this.route(this.getServiceBySlug));
    }
    service: ServiceService;

    @ApiOperationGet({
        path: "",
        operationId: "findAndCountAll",
        description: "Get all services",
        summary: "Get all services",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ServicePagingResponse },
                    },
                },
                description: "Filter Service success",
            },
        },
    })
    async findAndCountAll(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "getServiceBySlug",
        description: "Get Provider by slug or id",
        summary: "Get Provider by slug or id",
        parameters: {
            path: {
                slug: {
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
                        schema: { model: ServiceResponse },
                    },
                },
                description: "Provider success",
            },
            ...MappingErrorResponseSwaggerApi([
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED,
            ]),
        },
    })
    async getServiceBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.OR", [
            {
                id: slug,
            },
            {
                slug: slug,
            },
        ]);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
