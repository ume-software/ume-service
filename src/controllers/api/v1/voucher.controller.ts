import { UpdateVoucherRequest } from "@/common/requests";
import { CreateVoucherRequest } from "@/common/requests/voucher/createVoucher.request";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, voucherService } from "@/services";
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
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getMyVoucher)
        );
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerCreateVoucher)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerUpdateVoucher)
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
        path: "",
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

    @ApiOperationPost({
        path: "/{id}",
        operationId: "providerUpdateVoucher",
        security: {
            bearerAuth: [],
        },
        description: "Voucher for provider",
        summary: "Voucher for provider",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateVoucherRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UpdateVoucherRequest },
                    },
                },
                description: "Voucher provider success",
            },
        },
    })
    async providerUpdateVoucher(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.badRequest();
        }
        const providerUpdateVoucherRequest = new UpdateVoucherRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        providerUpdateVoucherRequest.id = id;
        const result = await this.service.providerUpdateVoucher(
            userId,
            providerUpdateVoucherRequest
        );
        this.onSuccess(res, result);
    }
}
