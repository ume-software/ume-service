import { BecomeProviderRequest } from "@/common/requests/becomeProvider.request";
import { BecomeProviderResponse } from "@/common/responses/becomeProvider.response";


import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { providerService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";
import { hostLanguageParameter } from "@/swagger/parameters/query.parameter";
import {
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/provider",
  name: "Provider",
})
export class ProviderController extends BaseController {
  constructor() {
    super();
    this.service = providerService;
    this.path = "provider";
    this.customRouting();
  }
  service: ProviderService;

  customRouting() {
    
    this.router.post(
      "/",
      this.accountTypeMiddlewares([EAccountType.USER]),
      this.route(this.becomeProvider)
    );
  }

  @ApiOperationPost({
    path: "",
    operationId: "becomeProvider",
    security: {
      bearerAuth: [],
    },
    description: "Register become provider",
    summary: "Register become provider",
    parameters: {
      query: hostLanguageParameter,
    },
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: BecomeProviderRequest },
        },
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: BecomeProviderResponse },
          },
        },
        description: "Register success",
      },
    },
  })
  async becomeProvider(req: Request, res: Response) {
    const becomeProviderRequest = req.body as BecomeProviderRequest;
    const userId = req.tokenInfo?.id;
    const result = await this.service.becomeProvider(
      userId!!,
      becomeProviderRequest
    );
    this.onSuccess(res, result);
  }
}
