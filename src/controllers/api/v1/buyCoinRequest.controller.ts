import { CreateBuyCoinRequest } from "@/common/requests/createBuyCoin.request";
import { CreateBuyCoinResponse } from "@/common/responses/createBuyCoin.response";
import { BaseController, Request, Response } from "@/controllers/base/base.controller";
import { buyCoinRequestService } from "@/services";
import { BuyCoinRequestService } from "@/services/api/v1/buyCoinRequest.service";
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/buy-coin-request",
  name: "BuyCoinRequest",
})
export class BuyCoinRequestController extends BaseController {
  constructor() {
    super();
    this.service = buyCoinRequestService;
    this.path = "buy-coin-request";
    this.customRouting();
  }
  service: BuyCoinRequestService;

  customRouting() {
    this.router.post("/", this.authMiddlewares(), this.route(this.createBuyCoinRequest));
  }

  @ApiOperationPost({
    path: "",
    operationId: "createBuyCoinRequest",
    security: {
      bearerAuth: [],
    },
    description: "Register become provider",
    summary: "Register become provider",
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: CreateBuyCoinRequest },
        },
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: CreateBuyCoinResponse },
          },
        },
        description: "Response create BuyCoin response success",
      },
    },
  })
  async createBuyCoinRequest(req: Request, res: Response) {
    const createBuyCoinRequest = req.body as CreateBuyCoinRequest;
    const userId = req.tokenInfo?.id;
    const result = await this.service.createBuyCoinRequest(
      userId!!,
      createBuyCoinRequest
    );
    this.onSuccess(res, result);
  }
}