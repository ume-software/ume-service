import { UpdateVoucherRequest, CreateVoucherRequest } from "@/common/requests";
import {
    CheckExistedResponse,
    VoucherPagingResponse,
    VoucherResponse,
} from "@/common/responses";
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
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

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
    private service: VoucherService;
    customRouting() {
        this.router.get(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.getMyVoucher)
        );
        this.router.get(
            "/provider",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.providerGetSelfVoucher)
        );
        this.router.get(
            "/check-code/:code",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.checkVoucherCodeExisted)
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
            query: {
                "provider-slug": {
                    name: "provider-slug",
                    required: false,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                        default: "42ac81c2-1815-45f7-b598-412487161e1f",
                    },
                    description: `
                    Example : provider-slug=42ac81c2-1815-45f7-b598-412487161e1f
                    `,
                },
                ...queryParameters,
            },
        },
        description: "Get My voucher",
        summary: "Get My voucher",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: VoucherPagingResponse },
                    },
                },
                description: "Voucher response success",
            },
        },
    })
    async getMyVoucher(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        let providerSlug = undefined;
        if (req.query["provider-slug"]) {
            providerSlug = req.query["provider-slug"]?.toString();
        }

        const result = await this.service.getMyVoucher(
            userId,
            providerSlug,
            req.queryInfoPrisma!
        );
        this.onSuccess(res, { row: result, count: result.length });
    }

    @ApiOperationGet({
        path: "/provider",
        operationId: "providerGetSelfVoucher",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Voucher for provider",
        summary: "Voucher for provider",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: VoucherPagingResponse },
                    },
                },
                description: "Voucher response success",
            },
        },
    })
    async providerGetSelfVoucher(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.providerId", userId);
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/check-code/{code}",
        operationId: "checkVoucherCodeExisted",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                code: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        description: "Check Voucher Code",
        summary: "Check Voucher Code",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: CheckExistedResponse },
                    },
                },
                description: "Check voucher code success",
            },
        },
    })
    async checkVoucherCodeExisted(req: Request, res: Response) {
        const { code } = req.params;
        const isExisted = await this.service.checkVoucherCodeExisted(code!);
        this.onSuccess(res, { isExisted });
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
                        schema: { model: VoucherResponse },
                    },
                },
                description: "Voucher response success",
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

    @ApiOperationPatch({
        path: "/{id}",
        operationId: "providerUpdateVoucher",
        security: {
            bearerAuth: [],
        },
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
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
                        schema: { model: VoucherResponse },
                    },
                },
                description: "Voucher response success",
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
