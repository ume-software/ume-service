import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiModel({
    description: "DetailAlbum response",
})
export class DetailAlbumResponse {

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
        description: "Url",
        required: true,
        example: "https://picsum.photos/seed/Xj1jIyR1U/640/480",
        type: SwaggerDefinitionConstant.STRING
    })
    url!: string;

    @ApiModelProperty({
        description: "Id's post",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING
    })
    postId!: string;
}
