import { BaseController } from "@/controllers/base/base.controller";
import { commentPostService } from "@/services";
import { CommentPostService } from "@/services/api/v1/commentPost.service";
import { ApiPath } from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/comment-post",
    name: "CommentPost",
})
export class CommentPostController extends BaseController {
    constructor() {
        super();
        this.service = commentPostService;
        this.path = "comment-post";
        this.customRouting();
    }
    service: CommentPostService;

    customRouting() { }
}