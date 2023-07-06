import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { ThumbnailResponse } from "./thumbnail.reponse";
import { UserInfomationResponse } from "./userInfomation.reponse";

@ApiModel({
    description: "Post response",
})
export class PostResponse {
    @ApiModelProperty({
        description: "Id's Post",
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
        model: UserInfomationResponse
    })
    user!: UserInfomationResponse;

    @ApiModelProperty({
        description: "Content",
        required: true,
        example: "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING
    })
    content!: string;

    @ApiModelProperty({
        description: "Thumbnails",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ThumbnailResponse,


    })
    thumbnails!: Array<ThumbnailResponse>;

    @ApiModelProperty({
        description: "Like count",
        required: true,
        example: 15,
    })
    likeCount!: number;

    @ApiModelProperty({
        description: "Is like",
        required: true,
        example: true,
    })
    isLike!: boolean;

    @ApiModelProperty({
        description: "Comment count",
        required: true,
        example: 4,
        type: SwaggerDefinitionConstant.NUMBER
    })
    commentCount!: string;
    
}
