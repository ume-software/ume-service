import { UserPaymentSystemRequest } from "@/common/requests/userPaymentSystem";
import { UserPaymentSystemResponse } from "@/common/responses";
import { UserPaymentSystemPagingResponse } from "@/common/responses/userPaymentSystem/userPaymentSystemPaging.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { userPaymentSystemService } from "@/services";
import { UserPaymentSystemService } from "@/services/api/v1/userPaymentSystem.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";

import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/user-payment-system",
    name: "UserPaymentSystem",
})
export class UserPaymentSystemController extends BaseController {
    constructor() {
        super();
        this.service = userPaymentSystemService;
        this.path = "user-payment-system";
        this.customRouting();
    }

    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getUserPaymentSystems)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createUserPaymentSystem)
        );
    }
    service: UserPaymentSystemService;

    @ApiOperationGet({
        path: "",
        operationId: "getUserPaymentSystems",
        security: {
            bearerAuth: [],
        },
        description: "get user payment systems",
        summary: "get user payment systems",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserPaymentSystemPagingResponse },
                    },
                },
                description: "Filter Service success",
            },
        },
    })
    async getUserPaymentSystems(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;

        let queryInfoPrisma = req.queryInfoPrisma || {};
        _.set(queryInfoPrisma, "where.userId", userId);
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createUserPaymentSystem",
        description: "Create User Payment System",
        summary: "Create User Payment System",
        security: {
            bearerAuth: [],
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UserPaymentSystemRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserPaymentSystemResponse },
                    },
                },
                description: "Amount UserPaymentSystem success",
            },
        },
    })
    async createUserPaymentSystem(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const userPaymentSystemRequest = new UserPaymentSystemRequest({
            userId,
            ...req.body,
        });
        const result = await this.service.create(userPaymentSystemRequest);
        this.onSuccess(res, result);
    }
}
