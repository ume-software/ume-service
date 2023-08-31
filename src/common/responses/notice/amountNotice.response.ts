import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";


@ApiModel({
    description: "Amount Notice response",
})
export class AmountNoticeResponse {

    @ApiModelProperty({
        description: "Amount number",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 10
    })
    amount!: number;
}
