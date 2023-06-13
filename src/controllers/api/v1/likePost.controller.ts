import { BaseController } from "@/controllers/base/base.controller";
import { likePostService } from "@/services";
import { LikePostService } from "@/services/api/v1/likePost.service";
import { ApiPath } from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/like-post",
    name: "LikePost",
})
export class LikePostController extends BaseController {
    constructor() {
        super();
        this.service = likePostService;
        this.path = "like-post";
        this.customRouting();
    }
    service: LikePostService;

    customRouting() { }
}