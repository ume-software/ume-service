import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Base single chart statistic response",
})
export class ElementBaseSingleChartStatisticResponse {
    @ApiModelProperty({
        description: "Value",
        example: 23,
    })
    value!: number;

    @ApiModelProperty({
        description: "Date",
        example: "2022-11-01T00:00:00.000Z",
    })
    time!: Date;
}
