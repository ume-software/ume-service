import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Base single chart statistic response",
})
export class ElementBaseSingleChartStatisticResponse {
    @ApiModelProperty({
        description: "Id",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Name",
        example: "Liên minh huyền thoại",
    })
    name!: string;

    @ApiModelProperty({
        description: "Value",
        example: 23,
    })
    value!: number;
}
