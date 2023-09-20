import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "District response",
})
export class DistrictResponse {
    @ApiModelProperty({
        description: "Id's district",
        required: true,
        example: "769",
        type: SwaggerDefinitionConstant.STRING,
    })
    id!: string;

    @ApiModelProperty({
        description: "District name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Thành phố Thủ Đức",
    })
    name!: string;

    @ApiModelProperty({
        description: "District english name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Thu Duc City",
    })
    enName!: string;

    @ApiModelProperty({
        description: "Id's province",
        required: true,
        example: "79",
        type: SwaggerDefinitionConstant.STRING,
    })
    provinceId!: string;
}
