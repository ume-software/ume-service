import { CreateServiceRequest } from "@/common/requests/service/createService.request";
import { UpdateServiceRequest } from "@/common/requests/service/updateService.request";
import { ServiceResponse } from "@/common/responses";
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
    ApiOperationPatch,
    ApiOperationPost,
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
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.createService)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.updateServiceById)
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

    @ApiOperationPost({
        path: "",
        operationId: "createService",
        security: {
            bearerAuth: [],
        },
        description: "Create Service",
        summary: "Create Service",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateServiceRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ServiceResponse },
                    },
                },
                description: "Create Service success",
            },
        },
    })
    async createService(req: Request, res: Response) {
        const createServiceRequest = new CreateServiceRequest(req.body);
        const result = await this.service.create(createServiceRequest);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "",
        operationId: "updateServiceById",
        security: {
            bearerAuth: [],
        },
        description: "Update service by id",
        summary: "Update service by id",
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
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateServiceRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ServiceResponse },
                    },
                },
                description: "Create Service success",
            },
        },
    })
    async updateServiceById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const createServiceRequest = new UpdateServiceRequest(req.body);
        const result = await this.service.updateServiceById(
            id!,
            createServiceRequest
        );
        this.onSuccess(res, result);
    }
}
