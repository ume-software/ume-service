import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { BecomeProviderRequest } from "@/common/requests/becomeProvider.request";
import { UpdateProviderProfileRequest } from "@/common/requests/updateProviderProfile.request";
import { AlbumPagingResponse } from "@/common/responses/albumPaging.response";
import { BecomeProviderResponse } from "@/common/responses/becomeProvider.response";
import { FilterProviderPagingResponse } from "@/common/responses/filterProviderPaging.response";
import { GetProfieProviderBySlugResponse } from "@/common/responses/getProfileProviderBySlug.respone";
import { UpdateProviderProfileResponse } from "@/common/responses/updateProviderProfile.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { errorService, providerService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";
import {
    filterHotProviderParameters,
    filterProviderParameters,
    limitParameter,
    orderParameter,
    pageParameter,
    queryParameters,
} from "@/swagger/parameters/query.parameter";
import {
    ApiOperationGet,
    ApiOperationPatch,
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
        this.router.get("/", this.route(this.getListProvider));
        this.router.get("/hot", this.route(this.getListHotProvider));
        this.router.get("/:slug", this.route(this.getProviderBySlug));
        this.router.get(
            "/:slug/album",
            this.route(this.getAblumByProviderSlug)
        );
        this.router.post(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.becomeProvider)
        );
        this.router.patch(
            "/",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.userUpdateProviderProfile)
        );
    }
    @ApiOperationGet({
        path: "",
        operationId: "getListProvider",
        description: "Get list provider",
        summary: "Get list provider",
        parameters: {
            query: {
                ...filterProviderParameters,
                ...limitParameter,
                ...pageParameter,
                ...orderParameter,
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: FilterProviderPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getListProvider(req: Request, res: Response) {
        const { queryInfoPrisma } = req;
        let { start_cost, end_cost, skill_id, name, gender } = req.query;
        start_cost = start_cost?.toString();
        const startCost = start_cost ? +start_cost : undefined;
        end_cost = end_cost?.toString();
        const endCost = end_cost ? +end_cost : undefined;
        const result = await this.service.filterProvider(
            {
                startCost,
                endCost,
                skillId: skill_id?.toString() || undefined,
                name,
                gender,
                order: queryInfoPrisma?.orderBy,
            } as IOptionFilterProvider,
            queryInfoPrisma!
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/hot",
        operationId: "getListHotProvider",
        description: "Get List Hot Providerr",
        summary: "Get List Hot Providerr",
        parameters: {
            query: {
                ...filterHotProviderParameters,
                ...queryParameters,
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: FilterProviderPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getListHotProvider(req: Request, res: Response) {
        const { queryInfoPrisma } = req;
        let { interval_days } = req.query;

        const result = await this.service.filterHotProvider(
            {
                intervalDays: +(interval_days || 7),
            } as IOptionFilterHotProvider,
            queryInfoPrisma!
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}/album",
        operationId: "getAblumByProviderSlug",
        description: "Get Provider by slug or id",
        summary: "Get Provider by slug or id",
        parameters: {
            query: {
                ...limitParameter,
                ...pageParameter,
            },

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
                        schema: { model: AlbumPagingResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getAblumByProviderSlug(req: Request, res: Response) {
        const queryInfoPrisma = req.queryInfoPrisma || {};
        const { slug } = req.params;
        const result = await this.service.getAblumByProviderSlug(
            slug!,
            queryInfoPrisma
        );
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/{slug}",
        operationId: "getProviderBySlug",
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
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: GetProfieProviderBySlugResponse },
                    },
                },
                description: "Provider success",
            },
        },
    })
    async getProviderBySlug(req: Request, res: Response) {
        const { slug } = req.params;
        const result = await this.service.getProviderBySlug(slug!);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "becomeProvider",
        security: {
            bearerAuth: [],
        },
        description: "Register become provider",
        summary: "Register become provider",
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

    @ApiOperationPatch({
        path: "",
        operationId: "userUpdateProviderProfile",
        security: {
            bearerAuth: [],
        },
        description: "User update provider profile",
        summary: "User update provider profile",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: UpdateProviderProfileRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UpdateProviderProfileResponse },
                    },
                },
                description: "Update provider profile response",
            },
        },
    })
    async userUpdateProviderProfile(req: Request, res: Response) {
        const updateProviderProfileRequest =
            req.body as UpdateProviderProfileRequest;
        const userId = req.tokenInfo?.id;
        if (!userId) {
            throw errorService.auth.badToken();
        }
        updateProviderProfileRequest.userId = userId;
        const result = await this.service.userUpdateProviderProfile(updateProviderProfileRequest);
        this.onSuccess(res, result);
    }
}
