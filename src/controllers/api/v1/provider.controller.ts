import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { BecomeProviderRequest } from "@/common/requests/becomeProvider.request";
import { BecomeProviderResponse } from "@/common/responses/becomeProvider.response";
import { CoinHistoryPagingResponse } from "@/common/responses/coinHistoryPaging.response";
import { FilterProviderPagingResponse } from "@/common/responses/filterProviderPaging.response";
import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { providerService } from "@/services";
import { ProviderService } from "@/services/api/v1/provider.service";
import {
  filterProviderParameters,
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
    this.router.get("/:slug", this.route(this.getProviderBySlug));
    this.router.post(
      "/",
      this.accountTypeMiddlewares([EAccountType.USER]),
      this.route(this.becomeProvider)
    );
  }
  @ApiOperationGet({
    path: "",
    operationId: "getListProvider",
    description: "Get list provider",
    summary: "Get list provider",
    parameters: {
      query: {
        ...queryParameters,
        ...filterProviderParameters,
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
    let { start_cost, end_cost, skill_id } = req.query;
    start_cost = start_cost?.toString();
    const startCost = start_cost ? +start_cost : undefined;
    end_cost = end_cost?.toString();
    const endCost = end_cost ? +end_cost : undefined;
    const result = await this.service.filterProvider(
      {
        startCost,
        endCost,
        skillId: skill_id?.toString() || undefined,
      } as IOptionFilterProvider,
      queryInfoPrisma!
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
      query: {
        ...hostLanguageParameter
      },
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: CoinHistoryPagingResponse },
          },
        },
        description: "Provider success",
      },
    },
  })
  async getProviderBySlug(req: Request, res: Response) {
    const { slug } = req.params
    const result = await this.service.getProviderBySlug(slug!)
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
    parameters: {
      query: hostLanguageParameter,
    },
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
}
