import { CommentPostPagingResponse } from "@/common/responses/commentPostPaging.response";
import { LikePostPagingResponse } from "@/common/responses/likePostPaging.response";
import { PostResponse } from "@/common/responses/post.response";
import { PostPagingResponse } from "@/common/responses/postPaging.response";
import { BaseController, Request, Response } from "@/controllers/base/base.controller";
import { commentPostService, errorService, likePostService, postService } from "@/services";
import { PostService } from "@/services/api/v1/post.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiPath({
  path: "/api/v1/post",
  name: "Post",
})
export class PostController extends BaseController {
  constructor() {
    super();
    this.service = postService;
    this.path = "post";
    this.customRouting();
  }
  service: PostService;

  customRouting() {
    this.router.get(
      "/suggest",
      this.authOrUnAuthMiddlewares(),
      this.route(this.suggestPost)
    );
    this.router.get(
      "/:id",
      this.route(this.getPostById)
    );
    this.router.get(
      "/:id/like",
      this.route(this.getLikeByPostId)
    );
    this.router.get(
      "/:id/comment",
      this.route(this.getCommentByPostId)
    );
  }

  @ApiOperationGet({
    path: "/suggest",
    operationId: "suggestPost",
    security: {
      bearerAuth: [],
    },
    description: "Get all posts",
    summary: "Get all posts",
    parameters: {
      query: queryParameters,
    },
    responses: {
      200: {
        content: {
          [SwaggerDefinitionConstant.Produce.JSON]: {
            schema: { model: PostPagingResponse },
          },
        },
        description: "Response post success",
      },
    },
  })
  async suggestPost(req: Request, res: Response) {
    const queryInfoPrisma = req.queryInfoPrisma;
    const userId = req.tokenInfo?.id;

    const result = await this.service.suggestPost(
      userId,
      queryInfoPrisma!
    );
    this.onSuccessAsList(res, result);
  }


  @ApiOperationGet({
    path: "/{id}",
    operationId: "getPostById",
    security: {
      bearerAuth: [],
    },
    description: "Get post by id",
    summary: "Get post by id",
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
            schema: { model: PostResponse },
          },
        },
        description: "Response post success",
      },
    },
  })
  async getPostById(req: Request, res: Response) {
    let queryInfoPrisma = req.queryInfoPrisma;
    const { id } = req.params;
    if (!id) {
      errorService.router.badRequest();
    }
    if (!queryInfoPrisma) queryInfoPrisma = {}
    queryInfoPrisma.where = {
      ...queryInfoPrisma.where,
      id
    }
    const result = await this.service.findOne(
      queryInfoPrisma
    );
    this.onSuccess(res, result);
  }

  @ApiOperationGet({
    path: "/{id}/like",
    operationId: "getLikeByPostId",
    security: {
      bearerAuth: [],
    },
    description: "Get like by post id",
    summary: "Get like by post id",
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
            schema: { model: LikePostPagingResponse },
          },
        },
        description: "Response post success",
      },
    },
  })
  async getLikeByPostId(req: Request, res: Response) {
    let queryInfoPrisma = req.queryInfoPrisma;
    const { id } = req.params;
    if (!id) {
      errorService.router.badRequest();
    }
    if (!queryInfoPrisma) queryInfoPrisma = {}
    queryInfoPrisma.where = {
      ...queryInfoPrisma.where,
      postId: id
    }
    const result = await likePostService.findAndCountAll(
      queryInfoPrisma
    );
    this.onSuccess(res, result);
  }

  @ApiOperationGet({
    path: "/{id}/comment",
    operationId: "getCommentByPostId",
    security: {
      bearerAuth: [],
    },
    description: "Get comment by post id",
    summary: "Get comment by post id",
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
            schema: { model: CommentPostPagingResponse },
          },
        },
        description: "Response post success",
      },
    },
  })
  async getCommentByPostId(req: Request, res: Response) {
    let queryInfoPrisma = req.queryInfoPrisma;
    const { id } = req.params;
    if (!id) {
      errorService.router.badRequest();
    }
    if (!queryInfoPrisma) queryInfoPrisma = {}
    queryInfoPrisma.where = {
      ...queryInfoPrisma.where,
      postId: id
    }
    const result = await commentPostService.findAndCountAll(
      queryInfoPrisma
    );
    this.onSuccess(res, result);
  }
}