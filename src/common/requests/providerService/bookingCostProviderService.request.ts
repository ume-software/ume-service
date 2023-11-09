import { IsNumber, IsOptional, IsUUID, Matches, Min } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
const timeOfDayRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
@ApiModel({
    description: "Booking cost provider service request",
})
export class BookingCostProviderServiceRequest {
    @ApiModelProperty({
        description: "Id Booking cost provider service",
        required: false,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    @IsOptional()
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
        description: "Amount",
        required: true,
        example: 10,
    })
    @Min(1)
    @IsNumber()
    amount!: number;

    constructor(data: BookingCostProviderServiceRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(BookingCostProviderServiceRequest, data, [
                    "id",
                    "startTimeOfDay",
                    "endTimeOfDay",
                    "amount",
                ])
            );
        }
    }
}
