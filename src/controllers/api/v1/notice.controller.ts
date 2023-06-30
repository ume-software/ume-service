
import { AmountNoticeResponse } from "@/common/responses/amountNotice.reponse";
import { NoticePagingResponse } from "@/common/responses/noticePaging.response";
import {
  BaseController,
  Request,
  Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import { noticeService } from "@/services";
import { NoticeService } from "@/services/api/v1/notice.service";
import {
  queryParameters,
} from "@/swagger/parameters/query.parameter";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/notice",
  name: "Notice",
})
export class NoticeController extends BaseController {
  constructor() {
    super();
    this.service = noticeService;
    this.path = "notice";
    this.customRouting();
  }

  customRouting() {
    this.router.get("/", this.accountTypeMiddlewares([EAccountType.USER]), this.route(this.getNotice));
    this.router.get("/amount-new", this.accountTypeMiddlewares([EAccountType.USER]), this.route(this.amountNewNotice));

  }
  service: NoticeService;

  @ApiOperationGet({
    path: "/amount-new",
    operationId: "amountNewNotice",
    description: "Count New Notices",
    summary: "Count New Notices",
    security: {
      bearerAuth: [],
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: AmountNoticeResponse },
          },
        },
        description: "Amount Notice success",
      },
    },
  })
  async amountNewNotice(req: Request, res: Response) {
    const userId = req.tokenInfo?.id;

    const result = await this.service.amountNewNoticeByUserId(userId!);
    this.onSuccess(res, result);
  }


  @ApiOperationGet({
    path: "",
    operationId: "getNotice",
    description: "Get all Notices",
    summary: "Get all Notices",
    security: {
      bearerAuth: [],
    },
    parameters: {
      query: queryParameters
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: NoticePagingResponse },
          },
        },
        description: "Filter Notice success",
      },
    },
  })
  async getNotice(req: Request, res: Response) {
    let queryInfoPrisma = req.queryInfoPrisma;
    const userId = req.tokenInfo?.id;

    const result = await this.service.getNotice(userId!, queryInfoPrisma);
    this.onSuccessAsList(res, result);
  }


}
