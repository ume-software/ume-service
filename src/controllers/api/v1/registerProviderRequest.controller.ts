import { UserRegisterBecomeProviderRequest } from "@/common/requests";
import { RegisterBecomeProviderResponse } from "@/common/responses";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { registerProviderRequestService } from "@/services";
import { RegisterProviderRequestService } from "@/services/api/v1/registerProviderRequest.service";
import {
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/register-provider-request",
    name: "UserRegisterProviderRequest",
})
export class RegisterProviderRequestController extends BaseController {
    constructor() {
        super();
        this.service = registerProviderRequestService;
        this.path = "register-provider-request";
        this.customRouting();
    }
    service: RegisterProviderRequestService;

    customRouting() {
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userRegisterBecomeProvider)
        );
    }

    @ApiOperationPost({
        path: "",
        operationId: "userRegisterBecomeProvider",
        security: {
            bearerAuth: [],
        },
        description: "Register become provider",
        summary: "Register become provider",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UserRegisterBecomeProviderRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: RegisterBecomeProviderResponse },
                    },
                },
                description: "Register success",
            },
        },
    })
    async userRegisterBecomeProvider(req: Request, res: Response) {
        const userRegisterBecomeProviderRequest =
            new UserRegisterBecomeProviderRequest(req.body);
        const userId = this.getTokenInfo(req).id;
        const result = await this.service.userRegisterBecomeProvider(
            userId,
            userRegisterBecomeProviderRequest
        );
        this.onSuccess(res, result);
    }
}
