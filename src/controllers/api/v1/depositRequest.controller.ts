import { CreateDepositRequest } from "@/common/requests/createDeposit.request";
import { CreateDepositResponse } from "@/common/responses/createDeposit.response";
import { BaseController, Request, Response } from "@/controllers/base/base.controller";
import { depositRequestService } from "@/services";
import { DepositRequestService } from "@/services/api/v1/depositRequest.service";
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/deposit-request",
  name: "DepositRequest",
})
export class DepositRequestController extends BaseController {
  constructor() {
    super();
    this.service = depositRequestService;
    this.path = "deposit-request";
    this.customRouting();
  }
  service: DepositRequestService;

  customRouting() {
    this.router.post("/", this.authMiddlewares(), this.route(this.createDepositRequest));
  }

  @ApiOperationPost({
    path: "",
    operationId: "createDepositRequest",
    security: {
      bearerAuth: [],
    },
    description: "Register become provider",
    summary: "Register become provider",
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: CreateDepositRequest },
        },
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: CreateDepositResponse },
          },
        },
        description: "Response create deposit response success",
      },
    },
  })
  async createDepositRequest(req: Request, res: Response) {
    const createDepositRequest = req.body as CreateDepositRequest;
    const userId = req.tokenInfo?.id;
    const result = await this.service.createDepositRequest(
      userId!!,
      createDepositRequest
    );
    this.onSuccess(res, result);
  }
}