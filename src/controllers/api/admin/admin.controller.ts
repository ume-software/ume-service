import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { adminService } from "@/services";
import { AdminService } from "@/services/api/v1/admin.service";
import {
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { CreateAdminAccountRequest } from "@/common/requests";
import { AdminInformationResponse } from "@/common/responses/admin";

@ApiPath({
    path: "/api/admin",
    name: "admin",
})
export class AdminController extends BaseController {
    constructor() {
        super();
        this.service = adminService;
        this.path = "admin";
        this.customRouting();
    }
    service: AdminService;

    customRouting() {
        this.router.post(
            "/create",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminCreateAccount)
        );
    }

    @ApiOperationPost({
        path: "/create",
        operationId: "adminCreateAccount",
        description: "Admin create account",
        summary: "Admin create account",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateAdminAccountRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminInformationResponse },
                    },
                },
                description: "Register token success",
            },
        },
    })
    async adminCreateAccount(req: Request, res: Response) {
        const createAdminAccountRequest = new CreateAdminAccountRequest(
            req.body
        );
        const adminId = this.getTokenInfo(req).id;
        const result = await this.service.adminCreateAccount(
            adminId!,
            createAdminAccountRequest
        );
        this.onSuccess(res, result);
    }
}
