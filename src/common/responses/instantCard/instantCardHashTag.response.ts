import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { HashTagResponse } from "../hashTag/hashTag.response";

@ApiModel({
    description: "Instant card hash tag response",
})
export class InstantCardHashTagResponse {
    @ApiModelProperty({
        description: "Id's instant card hash tag",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
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
        type: SwaggerDefinitionConstant.STRING,
    })
    userId!: string;

    @ApiModelProperty({
        description: "Instant card id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    instantCardId!: string;

    @ApiModelProperty({
        description: "Hash tag id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    hashTagId!: string;

    @ApiModelProperty({
        description: "Hash tag",
        required: true,
        model: HashTagResponse,
    })
    hashTag!: HashTagResponse;
}
