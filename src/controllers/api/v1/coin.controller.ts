import { PointForUserRequest } from "@/common/requests/adminCreatePointForUser.request";
import { UserCoinResponse } from "@/common/responses/userCoin.response";

import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { coinService } from "@/services";
import { CoinService } from "@/services/api/v1/coin.service";
import { hostLanguageParameter } from "@/swagger/parameters/query.parameter";
import {
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
    this.router.post(
      "/admin",
      this.accountTypeMiddlewares([EAccountType.ADMIN]),
      this.route(this.adminCreatePointForUser)
    );
  }

  @ApiOperationPost({
    path: "/admin",
    operationId: "adminCreatePointForUser",
    security: {
      bearerAuth: [],
    },
    description: "Admin create point for user",
    summary: "Admin create point for user",
    parameters: {
      query: hostLanguageParameter,
    },
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
