import {
    AdminGetUserPagingResponseResponse,
    AdminGetUserResponseResponse,
} from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { userService } from "@/services";
import { UserService } from "@/services/api/v1/user.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/admin/user",
    name: "AdminManageUser",
})
export class AdminManageUserController extends BaseController {
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
            this.route(this.adminGetListUser)
        );
        this.router.get(
            "/:slug",
            this.accountTypeMiddlewares([EAccountType.ADMIN]),
            this.route(this.adminGetUserBySlug)
        );
    }

    @ApiOperationGet({
        path: "",
        operationId: "adminGetListUser",
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
                        schema: { model: AdminGetUserPagingResponseResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async adminGetListUser(req: Request, res: Response) {
        let queryInfoPrisma = req.queryInfoPrisma;

        const result = await userService.findAndCountAll(queryInfoPrisma);
        this.onSuccess(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "adminGetUserBySlug",
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
            query: queryParameters,
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: AdminGetUserResponseResponse },
                    },
                },
                description: "Get information success",
            },
        },
    })
    async adminGetUserBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const queryInfoPrisma = req.queryInfoPrisma || {};
        if (!queryInfoPrisma.where) queryInfoPrisma.where = {};
        if (!queryInfoPrisma.where.OR) queryInfoPrisma.where.OR = [];
        queryInfoPrisma.where.OR = [
            ...queryInfoPrisma.where.OR,
            {
                id: slug,
            },
            {
                slug: slug,
            },
        ];

        const result = await userService.findOne(queryInfoPrisma);
        this.onSuccess(res, result);
    }
}
