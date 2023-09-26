import { CreateVoucherRequest } from "@/common/requests/voucher/createVoucher.request";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { voucherService } from "@/services";
import { VoucherService } from "@/services/api/v1/voucher.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/admin/voucher",
    name: "AdminManageVoucher",
})
export class AdminManageVoucherController extends BaseController {
    constructor() {
        super();
        this.service = voucherService;
        this.path = "voucher";
        this.customRouting();
    }
    service: VoucherService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetAllVoucher)
        );
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminCreateVoucher)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "adminGetAllVoucher",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Get all voucher",
        summary: "Get all voucher",
    })
    async adminGetAllVoucher(req: Request, res: Response) {
        const result = await this.service.findAndCountAll(req.queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
    @ApiOperationPost({
        path: "",
        operationId: "adminCreateVoucher",
        security: {
            bearerAuth: [],
        },
        description: "Voucher for provider",
        summary: "Voucher for provider",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateVoucherRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: CreateVoucherRequest },
                    },
                },
                description: "Voucher provider success",
            },
        },
    })
    async adminCreateVoucher(req: Request, res: Response) {
        const adminCreateVoucherRequest = new CreateVoucherRequest(req.body);
        const adminId = this.getTokenInfo(req).id;
        const result = await this.service.adminCreateVoucher(
            adminId,
            adminCreateVoucherRequest
        );
        this.onSuccess(res, result);
    }
}
