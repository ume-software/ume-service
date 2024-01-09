import {
    ReportUserPagingResponse,
    ReportUserResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { reportUserService } from "@/services";
import { ReportUserService } from "@/services/api/v1/reportUser.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

@ApiPath({
    path: "/api/v1/admin/report-user",
    name: "AdminManageReportUser",
})
export class AdminManageReportUserController extends BaseController {
    constructor() {
        super();
        this.service = reportUserService;
        this.path = "report-user";
        this.customRouting();
    }
    private service: ReportUserService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetReportUser)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.AdminGetOneReportUser)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetReportUser",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Admin get list report user",
        summary: "Admin get list report user",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ReportUserPagingResponse },
                    },
                },
                description: "Approved success",
            },
        },
    })
    async adminGetReportUser(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "AdminGetOneReportUser",
        security: {
            bearerAuth: [],
        },
        description: "Admin get one report user",
        summary: "Admin get one report user",
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
                        schema: { model: ReportUserResponse },
                    },
                },
                description: "Rejected success",
            },
        },
    })
    async AdminGetOneReportUser(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.id", id);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
