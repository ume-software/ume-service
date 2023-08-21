import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { UserInformationResponse } from "./userInformation.response";

@ApiModel({
    description: "Like post response",
})
export class LikePostResponse {
    @ApiModelProperty({
        description: "Id's like post",
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

}
