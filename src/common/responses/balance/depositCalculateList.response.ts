
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { DepositCalculateResponse } from "./depositCalculate.response";

@ApiModel({
    description: 'Buy coin calculate response'
})
export class DepositCalculateListResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: DepositCalculateResponse,
    })
    row!: Array<DepositCalculateResponse>;
}

