import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { PostResponse } from "./post.response";
import { UserInformationResponse } from "./userInformation.response";

@ApiModel({
    description: "User coin response",
})
export class WatchedPostResponse {
    @ApiModelProperty({
        description: "User id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    userId!: string;

    @ApiModelProperty({
        description: "User Information",
        required: false,
        model: UserInformationResponse,
    })
    user?: UserInformationResponse;

    @ApiModelProperty({
        description: "Post id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    postId!: string;

    @ApiModelProperty({
        description: "Post Information",
        required: false,
        model: PostResponse,
    })
    post?: PostResponse;
}
