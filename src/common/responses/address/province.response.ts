import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Province response",
})
export class ProvinceResponse {
    @ApiModelProperty({
        description: "Id's province",
        required: true,
        example: "79",
        type: SwaggerDefinitionConstant.STRING,
    })
    id!: string;

    @ApiModelProperty({
        description: "Province name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Thành Phố Hồ Chính Minh",
    })
    name!: string;

    @ApiModelProperty({
        description: "Province english name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Ho Chi Minh City",
    })
    enName!: string;
}
