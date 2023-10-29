import { BuyCoinPagingResponse, BuyCoinResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { buyCoinRequestService } from "@/services";
import { BuyCoinRequestService } from "@/services/api/v1/buyCoinRequest.service";
import {
    queryParameters,
    selectParameter,
} from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/admin/buy-coin-request",
    name: "AdminManageBuyCoinRequest",
})
export class AdminManageBuyCoinRequestController extends BaseController {
    constructor() {
        super();
        this.service = buyCoinRequestService;
        this.path = "buy-coin-request";
        this.customRouting();
    }
    service: BuyCoinRequestService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListBuyCoinRequest)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetOneBuyCoinRequest)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListBuyCoinRequest",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get list buy coin request",
        summary: "Admin get list buy coin request",
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
    async adminGetListBuyCoinRequest(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetOneBuyCoinRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin get one buy coin request",
        summary: "Admin get one buy coin request",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
            query: selectParameter,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: BuyCoinResponse },
                    },
                },
                description: "Rejected success",
            },
        },
    })
    async adminGetOneBuyCoinRequest(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
