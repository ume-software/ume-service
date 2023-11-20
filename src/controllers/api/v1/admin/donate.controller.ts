import { DonationPagingResponse,DonationResponse } from "@/common/responses";

import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { donationService } from "@/services";
import { DonationService } from "@/services/api/v1/donation.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/admin/donation",
    name: "AdminManageDonation",
})
export class AdminManageDonationController extends BaseController {
    constructor() {
        super();
        this.service = donationService;
        this.path = "donation";
        this.customRouting();
    }
    service: DonationService;
    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetListDonation)
        );
        this.router.get(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetDonationById)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListDonation",
        security: {
            bearerAuth: [],
        },
        parameters: {
            query: queryParameters,
        },
        description: "Get all donation",
        summary: "Get all donation",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DonationPagingResponse },
                    },
                },
                description: "Get all donation success",
            },
        },
    })
    async adminGetListDonation(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{id}",
        operationId: "adminGetDonationById",
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
            query: queryParameters,
        },
        description: "Get all donation",
        summary: "Get all donation",
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DonationResponse },
                    },
                },
                description: "Get all donation success",
            },
        },
    })
    async adminGetDonationById(req: Request, res: Response) {
        const { id } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        if (!queryInfoPrisma.where.id) queryInfoPrisma.where.id = id;

        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }
}
