import {
    ServiceAttributePagingResponse,
    ServiceResponse,
} from "@/common/responses";
import { ServicePagingResponse } from "@/common/responses/service/servicePaging.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, serviceService } from "@/services";
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
        this.router.get(
            "/not-registered",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerGetServiceHaveNotRegistered)
        );
        this.router.get(
            "/registered",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerGetServiceHaveRegistered)
        );
        this.router.get("/:slug", this.route(this.getServiceBySlug));
        this.router.get(
            "/:slug/attributes",
            this.route(this.getServiceAttributeByServiceSlug)
        );
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
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED,
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

        queryInfoPrisma.include = {
            serviceAttributes: {
                where: {
                    deletedAt: null,
                },
                include: {
                    serviceAttributeValues: {
                        where: {
                            deletedAt: null,
                        },
                    },
                },
            },
        };

        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
    @ApiOperationGet({
        path: "/not-registered",
        security: {
            bearerAuth: [],
        },
        operationId: "providerGetServiceHaveNotRegistered",
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
    async providerGetServiceHaveNotRegistered(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.providerGetServiceHaveNotRegistered(
            userId,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/registered",
        security: {
            bearerAuth: [],
        },
        operationId: "providerGetServiceHaveRegistered",
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
    async providerGetServiceHaveRegistered(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.providerGetServiceHaveRegistered(
            userId,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/attributes",
        operationId: "getServiceAttributeByServiceSlug",
        description: "Get Service Attribute By Service Slug",
        summary: "Get Service Attribute By Service Slug",
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
                        schema: { model: ServiceAttributePagingResponse },
                    },
                },
                description: "Provider success",
            },
            ...MappingErrorResponseSwaggerApi([
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED,
            ]),
        },
    })
    async getServiceAttributeByServiceSlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        const result = await this.service.getServiceAttributeByServiceSlug(
            slug,
            queryInfoPrisma
        );
        this.onSuccess(res, result);
    }
}
