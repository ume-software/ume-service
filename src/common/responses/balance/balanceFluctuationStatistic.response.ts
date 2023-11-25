import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BalanceFluctuationResponse } from "./balanceFluctuation.response";

@ApiModel({
    description: "Balance Fluctuation response",
})
export class BalanceFluctuationStatisticResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BalanceFluctuationResponse,
    })
    data!: Array<BalanceFluctuationResponse>;
}
