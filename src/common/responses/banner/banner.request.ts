import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Banner response",
})
export class BannerResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        required: true,
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        required: true,
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        required: false,
        example: "2023-05-10T07:08:46.083Z",
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Image Url",
        required: true,
        example: "Image url",
        type: SwaggerDefinitionConstant.STRING,
    })
    imageUrl!: string;

    @ApiModelProperty({
        description: "position",
        required: true,
        example: 1,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    position!: number;

    @ApiModelProperty({
        description: "Is Activated",
        required: false,
        example: true,

        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    isActivated?: Boolean;
}
