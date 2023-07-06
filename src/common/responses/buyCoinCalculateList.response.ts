
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { BuyCoinCalculateResponse } from "./buyCoinCalculate.response";

@ApiModel({
    description: 'Buy coin calculate response'
})
export class BuyCoinCalculateListResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BuyCoinCalculateResponse,
    })
    row!: Array<BuyCoinCalculateResponse>;
}

