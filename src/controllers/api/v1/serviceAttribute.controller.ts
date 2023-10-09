import { ServiceAttributeValuePagingResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { errorService, serviceAttributeService } from "@/services";
import { ServiceAttributeService } from "@/services/api/v1/serviceAttribute.service";
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
    path: "/api/v1/service-attribute",
    name: "ServiceAttribute",
})
export class ServiceAttributeController extends BaseController {
    constructor() {
        super();
        this.service = serviceAttributeService;
        this.path = "service-attribute";
        this.customRouting();
    }

    customRouting() {
        this.router.get(
            "/:id/values",
            this.route(this.getServiceAttributeValueByServiceAttributeId)
        );
    }
    service: ServiceAttributeService;

    @ApiOperationGet({
        path: "/{id}/values",
        operationId: "getServiceAttributeValueByServiceAttributeId",
        description: "Get Service Attribute Value By Service Attribute Id",
        summary: "Get Service Attribute Value By Service Attribute Id",
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
                        schema: { model: ServiceAttributeValuePagingResponse },
                    },
                },
                description: "Provider success",
            },
            ...MappingErrorResponseSwaggerApi([
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED,
            ]),
        },
    })
    async getServiceAttributeValueByServiceAttributeId(
        req: Request,
        res: Response
    ) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        const result =
            await this.service.getServiceAttributeValueByServiceAttributeId(
                id,
                queryInfoPrisma
            );
        this.onSuccess(res, result);
    }
}
