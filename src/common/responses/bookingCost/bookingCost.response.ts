import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "Booking cost response",
})
export class BookingCostResponse {
  @ApiModelProperty({
    description: "Id's provider",
    example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
  })
  id!: string;

  @ApiModelProperty({
    description: "Created At",
    example: "2023-05-10T07:08:46.083Z",
  })
  createdAt!: Date;

  @ApiModelProperty({
    description: "Update At",
    example: "2023-05-10T07:08:46.083Z",
  })
  updatedAt!: Date;

  @ApiModelProperty({
    description: "Deleted At",
    example: null,
  })
  deletedAt!: Date;

  @ApiModelProperty({
    description: "Provider service id",
    example: "42ac81c2-1815-45f7-b598-412487161e1f",
  })
  providerServiceId!: string;

  @ApiModelProperty({
    description: "Start time of day",
    example: "09:00",
  })
  startTimeOfDay!: string;

  @ApiModelProperty({
    description: "End time of day",
    example: "15:00",
  })
  endTimeOfDay!: string;

  @ApiModelProperty({
    description: "Amount",
    example: 10,
  })
  amount!: number;
}
