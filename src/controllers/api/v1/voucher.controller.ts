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
    path: "/api/v1/voucher",
    name: "Voucher",
})
export class VoucherController extends BaseController {
    constructor() {
        super();
        this.service = voucherService;
        this.path = "voucher";
        this.customRouting();
    }
    service: VoucherService;
    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getMyVoucher)
        );
        this.router.post(
            "/provider",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerCreateVoucher)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "getMyVoucher",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Voucher for provider",
        summary: "Voucher for provider",
    })
    async getMyVoucher(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.getMyVoucher(
            userId,
            req.queryInfoPrisma
        );
        this.onSuccess(res, { row: result });
    }
    @ApiOperationPost({
        path: "/provider",
        operationId: "providerCreateVoucher",
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
    async providerCreateVoucher(req: Request, res: Response) {
        const providerCreateVoucherRequest = new CreateVoucherRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.providerCreateVoucher(
            userId,
            providerCreateVoucherRequest
        );
        this.onSuccess(res, result);
    }
}
