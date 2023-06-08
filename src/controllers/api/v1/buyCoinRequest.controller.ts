import { BuyCoinHandleRequest } from "@/common/requests/buyCoinHandle.request";
import { CreateBuyCoinRequest } from "@/common/requests/createBuyCoin.request";
import { BuyCoinResponse } from "@/common/responses/buyCoin.response";
import { BaseController, Request, Response } from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { buyCoinRequestService } from "@/services";
import { BuyCoinRequestService } from "@/services/api/v1/buyCoinRequest.service";
import { handlerFilterBuyCoinParameters } from "@/swagger/parameters/query.parameter";
import { ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from "express-swagger-typescript";

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
    this.router.get("/request-to-handler", this.accountTypeMiddlewares([EAccountType.ADMIN]), this.route(this.getBuyCoinRequestToHandler));
    this.router.post("/", this.accountTypeMiddlewares([EAccountType.USER]), this.route(this.createBuyCoinRequest));
    this.router.post("/handle", this.accountTypeMiddlewares([EAccountType.ADMIN]), this.route(this.handleBuyCoinRequest));
  }
  @ApiOperationGet({
    path: "/request-to-handler",
    operationId: "getBuyCoinRequestToHandler",
    security: {
      bearerAuth: [],
    },
    parameters: {
      query: handlerFilterBuyCoinParameters
    },
    description: "Handler get all buy coin request to them",
    summary: "Handler get all buy coin request to them",
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: BuyCoinResponse },
          },
        },
        description: "Get list buy coin request success",
      },
    },
  })
  async getBuyCoinRequestToHandler(req: Request, res: Response) {
    let queryInfoPrisma = req.queryInfoPrisma;
    const { transaction_code: transactionCode, status } = req.query
    const userId = req.tokenInfo?.id;
    if (!queryInfoPrisma) queryInfoPrisma = {}
    delete queryInfoPrisma.select;
    delete queryInfoPrisma.include;
    queryInfoPrisma.where = {
      handlerId: userId
    }
    if (transactionCode) {
      queryInfoPrisma.where.transactionCode = {
        contains: transactionCode
      }
    }
    if (status) {
      queryInfoPrisma.where.status = status
    }
    const result = await this.service.findAndCountAll(queryInfoPrisma);
    this.onSuccessAsList(res, result);
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
            schema: { model: BuyCoinResponse },
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
            schema: { model: BuyCoinResponse },
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