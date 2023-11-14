import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ElementBaseSingleChartStatisticResponse } from "./elementBaseSingleChartStatistic.response";

@ApiModel({
    description: "Base single chart statistic response",
})
export class BaseSingleChartStatisticResponse {
    @ApiModelProperty({
        description: "Base single chart statistic data",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ElementBaseSingleChartStatisticResponse,
    })
    data!: Array<ElementBaseSingleChartStatisticResponse>;
}
