import { CommentPostRequest } from "@/common/requests/commentPost.request";
import { CreateNewPostRequest } from "@/common/requests/createNewPost.request";
import { CommentPostResponse } from "@/common/responses/commentPost.response";
import { CommentPostPagingResponse } from "@/common/responses/commentPostPaging.response";
import { LikePostPagingResponse } from "@/common/responses/likePostPaging.response";
import { PostResponse } from "@/common/responses/post.response";
import { PostPagingResponse } from "@/common/responses/postPaging.response";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { EAccountType } from "@/enums/accountType.enum";
import {
    commentPostService,
    errorService,
    likePostService,
    postService,
    watchedPostService,
} from "@/services";
import { PostService } from "@/services/api/v1/post.service";
import { queryParameters } from "@/swagger/parameters/query.parameter";
import { Prisma } from "@prisma/client";
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

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
        this.router.get("/:id", this.route(this.getPostById));
        this.router.get("/:id/like", this.route(this.getLikeByPostId));
        this.router.get("/:id/comment", this.route(this.getCommentByPostId));
        this.router.post(
            "",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.createPost)
        );
        this.router.post(
            "/:id/watched",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.watchedByPostId)
        );
        this.router.post(
            "/:id/like",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.likeForPostId)
        );
        this.router.post(
            "/:id/unlike",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.unlikeForPostId)
        );
        this.router.post(
            "/:id/comment",
            this.accountTypeMiddlewares([EAccountType.USER]),
            this.route(this.commentForPostId)
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

        const result = await this.service.suggestPost(userId, queryInfoPrisma!);
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
        const { id } = req.params;
        if (!id) {
            errorService.router.badRequest();
        }

        const result = await this.service.findById(id!);
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
        if (!queryInfoPrisma) queryInfoPrisma = {};
        queryInfoPrisma.where = {
            ...queryInfoPrisma.where,
            postId: id,
        };
        const result = await likePostService.findAndCountAll(queryInfoPrisma);
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
        if (!queryInfoPrisma) queryInfoPrisma = {};
        queryInfoPrisma.where = {
            ...queryInfoPrisma.where,
            postId: id,
        };
        const result = await commentPostService.findAndCountAll(
            queryInfoPrisma
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "",
        operationId: "createPost",
        security: {
            bearerAuth: [],
        },
        description: "Create new post",
        summary: "Create new post",
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CreateNewPostRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: PostResponse },
                    },
                },
                description: "Create post success",
            },
        },
    })
    async createPost(req: Request, res: Response) {
        const createNewPostRequest = req.body as CreateNewPostRequest;
        const creatorId = req.tokenInfo?.id;
        const result = await this.service.create(
            creatorId!,
            createNewPostRequest
        );
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/{id}/watched",
        operationId: "watchedByPostId",
        security: {
            bearerAuth: [],
        },
        description: "Like Post",
        summary: "Like Post",
        parameters: {
            path: {
                id: {
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
                        schema: { model: PostResponse },
                    },
                },
                description: "Watched post success",
            },
        },
    })
    async watchedByPostId(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            errorService.router.badRequest();
        }
        const requesterId = req.tokenInfo?.id;
        const result = await watchedPostService.create(requesterId!, id!);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/{id}/like",
        operationId: "likeForPostId",
        security: {
            bearerAuth: [],
        },
        description: "Like Post",
        summary: "Like Post",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
    })
    async likeForPostId(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            errorService.router.badRequest();
        }
        const requesterId = req.tokenInfo?.id;
        const result = await likePostService.like(requesterId!, id!);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/{id}/unlike",
        operationId: "unlikeForPostId",
        security: {
            bearerAuth: [],
        },
        description: "Unlike Post",
        summary: "Unlike Post",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
    })
    async unlikeForPostId(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) {
            errorService.router.badRequest();
        }
        const requesterId = req.tokenInfo?.id;
        const result = await likePostService.unlike(requesterId!, id!);
        this.onSuccess(res, result);
    }

    @ApiOperationPost({
        path: "/{id}/comment",
        operationId: "commentForPostId",
        security: {
            bearerAuth: [],
        },
        description: "Comment Post",
        summary: "Comment Post",
        parameters: {
            path: {
                id: {
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
            },
        },
        requestBody: {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: { model: CommentPostRequest },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: CommentPostResponse },
                    },
                },
                description: "Response post success",
            },
        },
    })
    async commentForPostId(req: Request, res: Response) {
        const { content, parentCommentId } = req.body as CommentPostRequest;
        const { id } = req.params;
        if (!id) {
            errorService.router.badRequest();
        }
        const requesterId = req.tokenInfo?.id;
        let commentPostCreateInput: Prisma.CommentPostCreateInput = {
            post: {
                connect: {
                    id: id!,
                },
            },
            user: {
                connect: {
                    id: requesterId!,
                },
            },
            content,
        };
        if (parentCommentId) {
            commentPostCreateInput.parentComment = {
                connect: {
                    id: parentCommentId!,
                },
            };
        }

        const result = await commentPostService.create(commentPostCreateInput);
        this.onSuccess(res, result);
    }
}
