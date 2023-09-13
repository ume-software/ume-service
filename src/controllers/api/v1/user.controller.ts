import { UpdateUserProfileRequest } from "@/common/requests";
import {
    UserInformationPagingResponse,
    UserInformationResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, userService } from "@/services";
import { UserService } from "@/services/api/v1/user.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/user",
    name: "user",
})
export class UserController extends BaseController {
    constructor() {
        super();
        this.service = userService;
        this.path = "user";
        this.customRouting();
    }
    service: UserService;

    customRouting() {
        this.router.get(
            "/",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.getListUser)
        );
        this.router.get("/:slug", this.route(this.getUserBySlug));
        this.router.patch(
            "/profile",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.updateUserProfile)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "getListUser",
        security: {
            bearerAuth: [],
        },
        description: "Get list user",
        summary: "Get list user",
        parameters: {
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationPagingResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async getListUser(req: Request, res: Response) {
        let queryInfoPrisma = req.queryInfoPrisma;

        const result = await userService.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "getUserBySlug",
        description: "Get user information",
        summary: "Get user information",
        parameters: {
            path: {
                slug: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async getUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        if (!slug) {
            throw errorService.badRequest();
        }
        const result = await userService.getUserBySlug(slug);
        this.onSuccess(res, result);
    }

    @ApiOperationPatch({
        path: "/profile",
        operationId: "updateUserProfile",
        security: {
            bearerAuth: [],
        },
        description: "Update user profile",
        summary: "Update user profile",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateUserProfileRequest },
                },
            },
            description: "Update user profile request",
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UserInformationResponse },
                    },
                },
                description: "Update user profile success",
            },
        },
    })
    async updateUserProfile(req: Request, res: Response) {
        const userId = this.getTokenInfo(req).id;
        const updateUserProfileRequest = new UpdateUserProfileRequest(req.body);
        if (!userId) {
            throw errorService.badToken();
        }
        const result = await userService.updateUserProfile(
            userId,
            updateUserProfileRequest
        );
        this.onSuccess(res, result);
    }
}
