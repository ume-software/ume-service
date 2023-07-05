import { DonateProviderRequest } from "@/common/requests/donateProvider.request";
import { PostResponse } from "@/common/responses/post.response";
import { TopDonateProviderPagingResponse } from "@/common/responses/topDonateProviderPaging.response";
import { TopUserDonatePagingResponse } from "@/common/responses/topUserDonatePaging.response";
import { BaseController, Request, Response } from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { ETopDonateDuration } from "@/enums/topDonateDuration.enum";
import { donateService } from "@/services";
import { DonateService } from "@/services/api/v1/donate.service";
import { filterTopDonateParameters } from "@/swagger/parameters/query.parameter";
import { ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/donate",
  name: "Donate",
})
export class DonateController extends BaseController {
  constructor() {
    super();
    this.service = donateService;
    this.path = "donate";
    this.customRouting();
  }
  service: DonateService;
  customRouting() {
    this.router.get("/provider/top", this.route(this.topDonateProvider));
    this.router.get("/user/top", this.route(this.topUserDonate));
    this.router.post("/provider", this.accountTypeMiddlewares([EAccountType.USER]), this.route(this.donateForProvider));
  }
  @ApiOperationGet({
    path: "/provider/top",
    operationId: "topDonateProvider",
    description: "Get top donate provider",
    summary: "Get top donate provider",
    parameters: {
      query: filterTopDonateParameters,
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: TopDonateProviderPagingResponse },
          },
        },
        description: "Response top donate provider success",
      },
    },
  })
  async topDonateProvider(req: Request, res: Response) {
    const { duration, top } = req.query;
    const result = await this.service.topDonateProvider(
      duration as ETopDonateDuration, Number.parseInt(top as string)
    );
    this.onSuccess(res, result);
  }

  @ApiOperationGet({
    path: "/user/top",
    operationId: "topUserDonate",
    description: "Get top user donate",
    summary: "Get top user donate",
    parameters: {
      query: filterTopDonateParameters,
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: TopUserDonatePagingResponse },
          },
        },
        description: "Response top user donate success",
      },
    },
  })
  async topUserDonate(req: Request, res: Response) {
    const { duration, top } = req.query;
    const result = await this.service.topUserDonate(
      duration as ETopDonateDuration, Number.parseInt(top as string)
    );
    this.onSuccess(res, result);
  }

  @ApiOperationPost({
    path: "/provider",
    operationId: "donateForProvider",
    security: {
      bearerAuth: [],
    },
    description: "Donate for provider",
    summary: "Donate for provider",
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: DonateProviderRequest },
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
        description: "Donate provider success",
      },
    },
  })
  async donateForProvider(req: Request, res: Response) {
    const donateProviderRequest = req.body as DonateProviderRequest;
    const creatorId = req.tokenInfo?.id;
    const result = await this.service.donateForProvider(creatorId!, donateProviderRequest)
    this.onSuccess(res, result);
  }
}