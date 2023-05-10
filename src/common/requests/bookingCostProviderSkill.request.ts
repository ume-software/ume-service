import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "Booking cost provider skill request",
})
export class BookingCostProviderSkillRequest {
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
}
