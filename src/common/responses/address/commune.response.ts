import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Commune response",
})
export class CommuneResponse {
    @ApiModelProperty({
        description: "Id's commune",
        required: true,
        example: "0001",
        type: SwaggerDefinitionConstant.STRING,
    })
    id!: string;

    @ApiModelProperty({
        description: "Commune name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Phường Tăng Nhơn Phú A",
    })
    name!: string;

    @ApiModelProperty({
        description: "Commune english name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Tang Nhon Phu A Ward",
    })
    enName!: string;

    @ApiModelProperty({
        description: "Id's district",
        required: true,
        example: "769",
        type: SwaggerDefinitionConstant.STRING,
    })
    districtId!: string;
}
