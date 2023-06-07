import { BuyCoinHandleRequest } from "@/common/requests/buyCoinHandle.request";
import { CreateBuyCoinRequest } from "@/common/requests/createBuyCoin.request";
import { CreateBuyCoinResponse } from "@/common/responses/createBuyCoin.response";
import { BaseController, Request, Response } from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
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
    this.router.post("/", this.accountTypeMiddlewares([EAccountType.USER]), this.route(this.createBuyCoinRequest));
    this.router.post("/handle", this.accountTypeMiddlewares([EAccountType.ADMIN]), this.route(this.handleBuyCoinRequest));
  }

  @ApiOperationPost({
    path: "",
    operationId: "createBuyCoinRequest",
    security: {
      bearerAuth: [],
    },
    description: "User create buy coin request",
    summary: "User create buy coin request",
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
        description: "Create buy coin request success",
      },
    },
  })
  async createBuyCoinRequest(req: Request, res: Response) {
    const createBuyCoinRequest = req.body as CreateBuyCoinRequest;
    const userId = req.tokenInfo?.id;
    const result = await this.service.createBuyCoin(
      userId!!,
      createBuyCoinRequest
    );
    this.onSuccess(res, result);
  }

  @ApiOperationPost({
    path: "/handle",
    operationId: "handleBuyCoinRequest",
    security: {
      bearerAuth: [],
    },
    description: "Handle buy coin request",
    summary: "Handle buy coin request",
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: BuyCoinHandleRequest },
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
        description: "Handle buy coin request success",
      },
    },
  })
  async handleBuyCoinRequest(req: Request, res: Response) {
    const buyCoinHandleRequest = req.body as BuyCoinHandleRequest;
    const userId = req.tokenInfo?.id;
    const result = await this.service.buyCoinHandle(
      userId!!,
      buyCoinHandleRequest
    );
    this.onSuccess(res, result);
  }
}