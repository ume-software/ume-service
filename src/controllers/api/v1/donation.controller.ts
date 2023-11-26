import { DonationRequest } from "@/common/requests";
import {
    PostResponse,
    TopDonationDonorPagingResponse,
    TopDonationRecipientPagingResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { ETopDonationDuration } from "@/enums/topDonationDuration.enum";
import { donationService } from "@/services";
import { DonationService } from "@/services/api/v1/donation.service";

import { filterTopDonationParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/donation",
    name: "Donation",
})
export class DonationController extends BaseController {
    constructor() {
        super();
        this.service = donationService;
        this.path = "donation";
        this.customRouting();
    }
    service: DonationService;
    customRouting() {
        this.router.get(
            "/top-recipient",
            this.route(this.topDonationRecipient)
        );
        this.router.get("/top-donor", this.route(this.topDonationDonor));
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.donationForRecipient)
        );
    }
    @ApiOperationGet({
        path: "/top-recipient",
        operationId: "topDonationRecipient",
        description: "Get top donation provider",
        summary: "Get top donation provider",
        parameters: {
            query: filterTopDonationParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: TopDonationRecipientPagingResponse },
                    },
                },
                description: "Response top donation provider success",
            },
        },
    })
    async topDonationRecipient(req: Request, res: Response) {
        const { duration, top } = req.query;
        const result = await this.service.topDonationRecipient(
            duration as ETopDonationDuration,
            Number.parseInt(top as string)
        );
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/top-donor",
        operationId: "topDonationDonor",
        description: "Get top donation donor",
        summary: "Get top donation donor",
        parameters: {
            query: filterTopDonationParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: TopDonationDonorPagingResponse },
                    },
                },
                description: "Response top user donation success",
            },
        },
    })
    async topDonationDonor(req: Request, res: Response) {
        const { duration, top } = req.query;
        const result = await this.service.topDonationDonor(
            duration as ETopDonationDuration,
            Number.parseInt(top as string)
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "donationForRecipient",
        security: {
            bearerAuth: [],
        },
        description: "Donation for provider",
        summary: "Donation for provider",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: DonationRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: PostResponse },
                    },
                },
                description: "Donation provider success",
            },
        },
    })
    async donationForRecipient(req: Request, res: Response) {
        const donationProviderRequest = new DonationRequest(req.body);
        const creatorId = req.tokenInfo?.id;
        const result = await this.service.donationForRecipient(
            creatorId!,
            donationProviderRequest
        );
        this.onSuccess(res, result);
    }
}
