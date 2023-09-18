import {
    ProviderSkillRequest,
    UpdateProviderSkillRequest,
} from "@/common/requests";
import {
    FeedbackPagingResponse,
    ProviderSkillPagingResponse,
    ProviderSkillResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { feedbackService, providerSkillService } from "@/services";
import { ProviderSkillService } from "@/services/api/v1/providerSkill.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/provider-skill",
    name: "ProviderSkill",
})
export class ProviderSkillController extends BaseController {
    constructor() {
        super();
        this.service = providerSkillService;
        this.path = "provider-skill";
        this.customRouting();
    }
    service: ProviderSkillService;

    customRouting() {
        this.router.get("/", this.route(this.getProviderSkill));
        this.router.get(
            "/:id/feedback",
            this.route(this.getFeedbackByProviderSkill)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createProviderSkill)
        );
        this.router.patch(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.updateProviderSkill)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "getProviderSkill",
        description: "Get all skills",
        summary: "Get all skills",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProviderSkillPagingResponse },
                    },
                },
                description: "Filter Provider Skill success",
            },
        },
    })
    async getProviderSkill(req: Request, res: Response) {
        let queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{id}/feedback",
        operationId: "getFeedbackByProviderSkill",
        description: "Get all skills",
        summary: "Get all skills",
        parameters: {
            path: {
                id: {
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
                        schema: { model: FeedbackPagingResponse },
                    },
                },
                description: "Filter Skill success",
            },
        },
    })
    async getFeedbackByProviderSkill(req: Request, res: Response) {
        const { id: providerSkillId } = req.params;
        let queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        queryInfoPrisma.where.booking = {
            providerSkillId,
        };
        const result = await feedbackService.getFeedbackByProviderSkill(
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createProviderSkill",
        security: {
            bearerAuth: [],
        },
        description: "Register become providerSkill",
        summary: "Register become providerSkill",
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
                        schema: { model: ProviderSkillResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async createProviderSkill(req: Request, res: Response) {
        const providerSkillRequest = new ProviderSkillRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.create(userId, providerSkillRequest);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "",
        operationId: "updateProviderSkill",
        security: {
            bearerAuth: [],
        },
        description: "Update provider skill",
        summary: "Update provider skill",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateProviderSkillRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProviderSkillResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async updateProviderSkill(req: Request, res: Response) {
        const updateProviderSkillRequest = new UpdateProviderSkillRequest(
            req.body
        );
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.updateProviderSkill(
            userId,
            updateProviderSkillRequest
        );
        this.onSuccess(res, result);
    }
}
