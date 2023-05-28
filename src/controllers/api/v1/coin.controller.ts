import { PointForUserRequest } from "@/common/requests/adminCreatePointForUser.request";
import { CoinHistoryPagingResponse } from "@/common/responses/coinHistoryPaging.response";
import { UserCoinResponse } from "@/common/responses/userCoin.response";

import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { coinService } from "@/services";
import { CoinService } from "@/services/api/v1/coin.service";
import {
  queryParameters
} from "@/swagger/parameters/query.parameter";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/coin",
  name: "Coin",
})
export class coinController extends BaseController {
  constructor() {
    super();
    this.service = coinService;
    this.path = "coin";
    this.customRouting();
  }
  service: CoinService;

  customRouting() {
    this.router.get(
      "/history",
      this.accountTypeMiddlewares([EAccountType.USER]),
      this.route(this.getMyHistoryCoin)
    );
    this.router.get(
      "/total",
      this.accountTypeMiddlewares([EAccountType.USER]),
      this.route(this.getMyTotalCoin)
    );
    this.router.post(
      "/admin",
      this.accountTypeMiddlewares([EAccountType.ADMIN]),
      this.route(this.adminCreatePointForUser)
    );
  }
  @ApiOperationGet({
    path: "/history",
    operationId: "getMyHistoryCoin",
    security: {
      bearerAuth: [],
    },
    description: "Get hisotory coins of the user himself",
    summary: "Get hisotory coins of the user himself",
    parameters: {
      query: queryParameters,
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: CoinHistoryPagingResponse },
          },
        },
        description: "Response coin history success",
      },
    },
  })
  async getMyHistoryCoin(req: Request, res: Response) {
    const queryInfoPrisma = req.queryInfoPrisma;
    const userId = req.tokenInfo?.id;
    const result = await this.service.getHistoryCoinByUserId(
      userId!,
      queryInfoPrisma!
    );
    this.onSuccessAsList(res, result);
  }

  @ApiOperationGet({
    path: "/total",
    operationId: "getMyTotalCoin",
    security: {
      bearerAuth: [],
    },
    description: "Total number of coins of the user himself",
    summary: "Total number of coins of the user himself",
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: UserCoinResponse },
          },
        },
        description: "Get total point success",
      },
    },
  })
  async getMyTotalCoin(req: Request, res: Response) {
    const userId = req.tokenInfo?.id;
    const result = await this.service.getTotalCoinByUserId(userId!);
    this.onSuccess(res, result);
  }

  @ApiOperationPost({
    path: "/admin",
    operationId: "adminCreatePointForUser",
    security: {
      bearerAuth: [],
    },
    description: "Admin create point for user",
    summary: "Admin create point for user",
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: PointForUserRequest },
        },
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: UserCoinResponse },
          },
        },
        description: "Register success",
      },
    },
  })
  async adminCreatePointForUser(req: Request, res: Response) {
    const pointForUserRequest = req.body as PointForUserRequest;
    const adminId = req.tokenInfo?.id;
    const result = await this.service.adminCreatePointToUser(
      adminId!!,
      pointForUserRequest
    );
    this.onSuccess(res, result);
  }
}
