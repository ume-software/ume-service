import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Check existed response",
})
export class CheckExistedResponse {
    @ApiModelProperty({
        description: "Is existed",
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: true,
    })
    isExisted!: boolean;
}
