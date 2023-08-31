import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { UserInformationResponse } from "../user/userInformation.response";

@ApiModel({
    description: "Comment post response",
})
export class CommentPostResponse {
    @ApiModelProperty({
        description: "Id's comment post",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        example: null,
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Id's user",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING
    })
    userId!: string;

    @ApiModelProperty({
        description: "User",
        required: true,
        model: UserInformationResponse
    })
    user!: UserInformationResponse;

    @ApiModelProperty({
        description: "Post id",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING
    })
    postId!: string;

    @ApiModelProperty({
        description: "Content",
        required: true,
        example: "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati",
        type: SwaggerDefinitionConstant.STRING
    })
    content!: string;

}
