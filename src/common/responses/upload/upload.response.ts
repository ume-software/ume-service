import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Upload response",
})
export class UploadResponse {
    @ApiModelProperty({
        description: "results",
        example: ["url1", "url2"],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    results!: Array<string>;
}
