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
    path: "/api/admin/service",
    name: "AdminManageService",
})
export class AdminManageServiceController extends BaseController {
    constructor() {
        super();
        this.service = serviceService;
        this.path = "service";
        this.customRouting();
    }

    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetAllServices)
        );
        this.router.get(
            "/:slug",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetServiceBySlug)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminCreateService)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminUpdateServiceById)
        );
    }
    service: ServiceService;

    @ApiOperationGet({
        path: "",
        operationId: "adminGetAllServices",
        description: "Get all services",
        summary: "Get all services",
        security: {
            bearerAuth: [],
        },
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
    async adminGetAllServices(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "adminGetServiceBySlug",
        description: "Get Provider by slug or id",
        summary: "Get Provider by slug or id",
        security: {
            bearerAuth: [],
        },
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
    async adminGetServiceBySlug(req: Request, res: Response) {
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
        operationId: "adminCreateService",
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
    async adminCreateService(req: Request, res: Response) {
        const createServiceRequest = new CreateServiceRequest(req.body);
        const result = await this.service.create(createServiceRequest);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "",
        operationId: "adminUpdateServiceById",
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
    async adminUpdateServiceById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const createServiceRequest = new UpdateServiceRequest(req.body);
        const result = createServiceRequest;
        // await this.service.updateServiceById(
        //     id!,
        //     createServiceRequest
        // );
        this.onSuccess(res, result);
    }
}
