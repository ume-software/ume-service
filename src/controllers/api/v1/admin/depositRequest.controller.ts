import { DepositPagingResponse, DepositResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { depositRequestService } from "@/services";
import { DepositRequestService } from "@/services/api/v1/depositRequest.service";
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
    path: "/api/v1/admin/deposit-request",
    name: "AdminManageDepositRequest",
})
export class AdminManageDepositRequestController extends BaseController {
    constructor() {
        super();
        this.service = depositRequestService;
        this.path = "deposit-request";
        this.customRouting();
    }
    private service: DepositRequestService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListDepositRequest)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetOneDepositRequest)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListDepositRequest",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get list deposit request",
        summary: "Admin get list deposit request",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DepositPagingResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async adminGetListDepositRequest(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetOneDepositRequest",
        security: {
            bearerAuth: [],
        },
        description: "Admin get one deposit request",
        summary: "Admin get one deposit request",
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
                        schema: { model: DepositResponse },
                    },
                },
                description: "Rejected success",
            },
        },
    })
    async adminGetOneDepositRequest(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
