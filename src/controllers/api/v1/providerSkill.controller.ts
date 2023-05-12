


import { ProviderSkillRequest } from "@/common/requests/providerSkill.request";
import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { providerSkillService } from "@/services";
import { ProviderSkillService } from "@/services/api/v1/providerSkill.service";
import { hostLanguageParameter } from "@/swagger/parameters/query.parameter";
import {
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/provider_skill",
  name: "ProviderSkill",
})
export class ProviderSkillController extends BaseController {
  constructor() {
    super();
    this.service = providerSkillService;
    this.path = "provider_skill";
    this.customRouting();
  }
  service: ProviderSkillService;

  customRouting() {
    
    this.router.post(
      "/",
      this.accountTypeMiddlewares([EAccountType.USER]),
      this.route(this.createProviderSkill)
    );
  }

  @ApiOperationPost({
    path: "",
    operationId: "createProviderSkill",
    security: {
      bearerAuth: [],
    },
    description: "Register become providerSkill",
    summary: "Register become providerSkill",
    parameters: {
      query: hostLanguageParameter,
    },
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: ProviderSkillRequest },
        },
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: ProviderSkillRequest },
          },
        },
        description: "Register success",
      },
    },
  })
  async createProviderSkill(req: Request, res: Response) {
    const providerSkillRequest = req.body as ProviderSkillRequest;
    const userId = req.tokenInfo?.id;
    const result = await this.service.create(
      userId!!,
      providerSkillRequest
    );
    this.onSuccess(res, result);
  }
}
