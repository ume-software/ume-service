import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ElementBaseSingleChartTimeStatisticResponse } from "./elementBaseSingleChartTimeStatistic.response";

@ApiModel({
    description: "Base single chart statistic response",
})
export class BaseSingleChartTimeStatisticResponse {
    @ApiModelProperty({
        description: "Base single chart statistic data",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ElementBaseSingleChartTimeStatisticResponse,
    })
    data!: Array<ElementBaseSingleChartTimeStatisticResponse>;
}
