import {
    ProviderServiceRequest,
    UpdateProviderServiceRequest,
} from "@/common/requests";
import {
    FeedbackPagingResponse,
    ProviderServicePagingResponse,
    ProviderServiceResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { feedbackService, providerServiceService } from "@/services";
import { ProviderServiceService } from "@/services/api/v1/providerService.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/provider-service",
    name: "ProviderService",
})
export class ProviderServiceController extends BaseController {
    constructor() {
        super();
        this.service = providerServiceService;
        this.path = "provider-service";
        this.customRouting();
    }
    service: ProviderServiceService;

    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerGetOwnServices)
        );
        this.router.get(
            "/:id/feedback",
            this.route(this.getFeedbackByProviderService)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createProviderService)
        );
        this.router.patch(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.updateProviderService)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "providerGetOwnServices",
        security: {
            bearerAuth: [],
        },
        description: "Get all services",
        summary: "Get all services",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProviderServicePagingResponse },
                    },
                },
                description: "Filter Service success",
            },
        },
    })
    async providerGetOwnServices(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;

        let queryInfoPrisma = req.queryInfoPrisma || {};
        _.set(queryInfoPrisma, "where.providerId", userId);

        queryInfoPrisma.include = {
            bookingCosts: {
                where: {
                    deletedAt: null,
                },
            },
            service: true,
            providerServiceAttributes: {
                include: {
                    serviceAttribute: true,
                    providerServiceAttributeValues: {
                        include: {
                            serviceAttributeValue: true,
                        },
                        where: {
                            deletedAt: null,
                        },
                    },
                },
                where: {
                    deletedAt: null,
                },
            },
        };
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationGet({
        path: "/{id}/feedback",
        operationId: "getFeedbackByProviderService",
        description: "Get all services",
        summary: "Get all services",
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
                        schema: { model: FeedbackPagingResponse },
                    },
                },
                description: "Filter Service success",
            },
        },
    })
    async getFeedbackByProviderService(req: Request, res: Response) {
        const { id: providerServiceId } = req.params;
        let queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        queryInfoPrisma.where.booking = {
            providerServiceId,
        };
        const result = await feedbackService.getFeedbackByProviderService(
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createProviderService",
        security: {
            bearerAuth: [],
        },
        description: "Register become providerService",
        summary: "Register become providerService",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: ProviderServiceRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProviderServiceResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async createProviderService(req: Request, res: Response) {
        const providerServiceRequest = new ProviderServiceRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.create(
            userId,
            providerServiceRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "",
        operationId: "updateProviderService",
        security: {
            bearerAuth: [],
        },
        description: "Update provider service",
        summary: "Update provider service",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateProviderServiceRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProviderServiceResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async updateProviderService(req: Request, res: Response) {
        const updateProviderServiceRequest = new UpdateProviderServiceRequest(
            req.body
        );
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.updateProviderService(
            userId,
            updateProviderServiceRequest
        );
        this.onSuccess(res, result);
    }
}
