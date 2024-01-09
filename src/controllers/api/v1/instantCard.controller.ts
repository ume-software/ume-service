import { CreateNewInstantCardRequest } from "@/common/requests";
import {
    InstantCardPagingResponse,
    InstantCardResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { instantCardService } from "@/services";
import { InstantCardService } from "@/services/api/v1/instantCard.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/instant-card",
    name: "InstantCard",
})
export class InstantCardController extends BaseController {
    constructor() {
        super();
        this.service = instantCardService;
        this.path = "instant-card";
        this.customRouting();
    }
    private service: InstantCardService;
    customRouting() {
        this.router.get("/", this.route(this.getAllInstantCard));
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createInstantCard)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "getAllInstantCard",
        description: "Get all instant card",
        summary: "Get all instant card",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: InstantCardPagingResponse },
                    },
                },
                description: "Get all instant card",
            },
        },
    })
    async getAllInstantCard(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const result = await this.service.findAndCountAll(queryInfoPrisma);
        this.onSuccessAsList(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createInstantCard",
        description: "Get all instant card",
        summary: "Get all instant card",
        security: {
            bearerAuth: [],
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateNewInstantCardRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: InstantCardResponse },
                    },
                },
                description: "Get all instant card",
            },
        },
    })
    async createInstantCard(req: Request, res: Response) {
        const createNewInstantCardRequest = new CreateNewInstantCardRequest({
            userId: this.getTokenInfo(req).id,
            ...req.body,
        });
        const result = await this.service.create(createNewInstantCardRequest);
        this.onSuccess(res, result);
    }
}
