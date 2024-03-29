import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
@ApiModel({
    description: "Booking History response",
})
export class AdminGetBookingStatisticResponse {
    @ApiModelProperty({
        description: "Star",
        required: false,
        example: 4.5,
    })
    star?: number;

    @ApiModelProperty({
        description: "Total feedback",
        required: false,
        example: 100,
    })
    totalFeedback?: number;

    @ApiModelProperty({
        description: "Total time",
        required: false,
        example: 16,
    })
    totalTime?: number;

    @ApiModelProperty({
        description: "Total revenue",
        required: false,
        example: 2,
    })
    totalRevenue?: number;

    @ApiModelProperty({
        description: "Total profit",
        required: false,
        example: 16,
    })
    totalProfit?: number;

    @ApiModelProperty({
        description: "Total booking success",
        required: false,
        example: 2,
    })
    totalBookingSuccess?: number;
}
