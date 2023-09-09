import { IsNumber, IsUUID, Matches, Min } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
const timeOfDayRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
@ApiModel({
    description: "Booking cost provider skill request",
})
export class BookingCostProviderSkillRequest {
    @ApiModelProperty({
        description: "Id Booking cost provider skill",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    id!: string;

    @ApiModelProperty({
        description: "The start time that this charge is in effect",
        required: true,
        example: "09:00",
    })
    @Matches(timeOfDayRegex)
    startTimeOfDay!: string;

    @ApiModelProperty({
        description: "The end time that this charge is in effect",
        required: true,
        example: "15:00",
    })
    @Matches(timeOfDayRegex)
    endTimeOfDay!: string;

    @ApiModelProperty({
        description: "Amount coin",
        required: true,
        example: 10,
    })
    @Min(1)
    @IsNumber()
    amount!: number;

    constructor(data: BookingCostProviderSkillRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(BookingCostProviderSkillRequest, data, [
                    "id",
                    "startTimeOfDay",
                    "endTimeOfDay",
                    "amount",
                ])
            );
        }
    }
}
