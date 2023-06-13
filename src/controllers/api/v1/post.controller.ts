import { BaseController } from "@/controllers/base/base.controller";
import { postService } from "@/services";
import { PostService } from "@/services/api/v1/post.service";
import { ApiPath } from "express-swagger-typescript";

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

    customRouting() { }
}