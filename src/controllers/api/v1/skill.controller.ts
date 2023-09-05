import { CreateSkillRequest } from "@/common/requests/skill/createSkill.request";
import { UpdateSkillRequest } from "@/common/requests/skill/updateSkill.request";
import { SkillResponse } from "@/common/responses";
import { SkillPagingResponse } from "@/common/responses/skill/skillPaging.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, skillService } from "@/services";
import { SkillService } from "@/services/api/v1/skill.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import _ from "lodash";

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
        this.router.get("/:slug", this.route(this.getSkillBySlug));
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.createSkill)
        );
        this.router.patch(
            "/:id",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.updateSkillById)
        );
    }
    service: SkillService;

    @ApiOperationGet({
        path: "",
        operationId: "findAndCountAll",
        description: "Get all skills",
        summary: "Get all skills",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: SkillPagingResponse },
                    },
                },
                description: "Filter Skill success",
            },
        },
    })
    async findAndCountAll(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma;
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "getSkillBySlug",
        description: "Get Provider by slug or id",
        summary: "Get Provider by slug or id",
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: SkillResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getSkillBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma ?? {};
        _.set(queryInfoPrisma, "where.OR", [
            {
                id: slug,
            },
            {
                slug: slug,
            },
        ]);
        const result = await this.service.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createSkill",
        security: {
            bearerAuth: [],
        },
        description: "Create Skill",
        summary: "Create Skill",
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
                        schema: { model: SkillResponse },
                    },
                },
                description: "Create Skill success",
            },
        },
    })
    async createSkill(req: Request, res: Response) {
        const createSkillRequest = new CreateSkillRequest(req.body);
        const result = await this.service.create(createSkillRequest);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "",
        operationId: "updateSkillById",
        security: {
            bearerAuth: [],
        },
        description: "Update skill by id",
        summary: "Update skill by id",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateSkillRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: SkillResponse },
                    },
                },
                description: "Create Skill success",
            },
        },
    })
    async updateSkillById(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            throw errorService.router.badRequest();
        }
        const createSkillRequest = new UpdateSkillRequest(req.body);
        const result = await this.service.updateSkillById(
            id!,
            createSkillRequest
        );
        this.onSuccess(res, result);
    }
}
