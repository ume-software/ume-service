import { TopHashTagResponse } from "@/common/responses/hashTag/instantCardPaging.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { hashTagService } from "@/services";
import { HashTagService } from "@/services/api/v1/hashTag.service";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/hashtag",
    name: "HashTag",
})
export class HashTagController extends BaseController {
    constructor() {
        super();
        this.service = hashTagService;
        this.path = "hashtag";
        this.customRouting();
    }
    service: HashTagService;
    customRouting() {
        this.router.get(
            "/top-instant-card",
            this.route(this.getTopInstantCardHashTags)
        );
    }

    @ApiOperationGet({
        path: "/top-instant-card",
        operationId: "getTopInstantCardHashTags",
        description: "Get top hash tags",
        summary: "Get top hash tags",
        parameters: {
            query: {
                top: {
                    name: "top",
                    required: false,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                        default: "1",
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: TopHashTagResponse },
                    },
                },
                description: "Get top hash tags",
            },
        },
    })
    async getTopInstantCardHashTags(req: Request, res: Response) {
        const top = +(req.query?.["top"]?.toString() || "1");
        const result = await this.service.getTopInstantCardHashTags(top);
        this.onSuccessAsList(res, result);
    }
}
