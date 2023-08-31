import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Booking cost provider skill request",
})
export class BookingCostProviderSkillRequest {
    @ApiModelProperty({
        description: "Id Booking cost provider skill",
        required: false,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    id!: string;

    @ApiModelProperty({
        description: "The start time that this charge is in effect",
        required: true,
        example: "09:00",
    })
    startTimeOfDay!: string;

    @ApiModelProperty({
        description: "The end time that this charge is in effect",
        required: true,
        example: "15:00",
    })
    endTimeOfDay!: string;

    @ApiModelProperty({
        description: "Amount coin",
        required: true,
        example: 10,
    })
    amount!: number;

    constructor(data: BookingCostProviderSkillRequest) {
        this.amount = data.amount;
        this.endTimeOfDay = data.endTimeOfDay;
        this.id = data.id;
        this.startTimeOfDay = data.startTimeOfDay;
    }
}
