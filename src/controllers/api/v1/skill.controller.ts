import { CreateSkillRequest } from "@/common/requests/createSkill.request";
import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { skillService } from "@/services";
import { SkillService } from "@/services/api/v1/skill.service";
import {
  hostLanguageParameter,
  queryParameters,
} from "@/swagger/parameters/query.parameter";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/skill",
  name: "Skill",
})
export class SkillController extends BaseController {
  constructor() {
    super();
    this.service = skillService;
    this.path = "skill";
    this.customRouting();
  }

  customRouting() {
    this.router.get("/", this.route(this.findAndCountAll));
    this.router.post(
      "/",
      this.accountTypeMiddlewares([EAccountType.ADMIN]),
      this.route(this.create)
    );
  }
  service: SkillService;

  @ApiOperationGet({
    path: "",
    operationId: "findAndCountAll",
    description: "Get all skills",
    summary: "Get all skills",
    parameters: {
      query: queryParameters
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: CreateSkillRequest },
          },
        },
        description: "Create Skill success",
      },
    },
  })
  async findAndCountAll(req: Request, res: Response) {
    const queryInfoPrisma = req.queryInfoPrisma;
    const result = await this.service.findAndCountAll(queryInfoPrisma);
    this.onSuccessAsList(res, result);
  }

  @ApiOperationPost({
    path: "",
    operationId: "createSkill",
    security: {
      bearerAuth: [],
    },
    description: "Create Skill",
    summary: "Create Skill",
    parameters: {
      query: hostLanguageParameter,
    },
    requestBody: {
      content: {
        [SwaggerDefinitionConstant.Produce.JSON]: {
          schema: { model: CreateSkillRequest },
        },
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: CreateSkillRequest },
          },
        },
        description: "Create Skill success",
      },
    },
  })
  async create(req: Request, res: Response) {
    const createSkillRequest = req.body as CreateSkillRequest;
    const result = await this.service.create(createSkillRequest);
    this.onSuccess(res, result);
  }
}
