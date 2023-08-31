import { CreateVoucherRequest } from "@/common/requests/voucher/createVoucher.request";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { redisService, voucherService } from "@/services";
import { VoucherService } from "@/services/api/v1/voucher.service";
import {
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
        this.router.post(
            "/provider",
            // this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerCreateVoucher)
        );
    }

    @ApiOperationPost({
        path: "/provider",
        operationId: "providerCreateVoucher",
        // security: {
        //     bearerAuth: [],
        // },
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
        const voucherProviderRequest = new CreateVoucherRequest(req.body);
        console.log("key ===> ", await redisService.get("key"));
        this.onSuccess(res, voucherProviderRequest);
    }
}
