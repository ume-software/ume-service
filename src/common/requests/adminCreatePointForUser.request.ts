import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "User registor become provider",
})
export class PointForUserRequest {
  @ApiModelProperty({
    description: "Amount",
    required: true,
    example: 10,
  })
  amount!: number;

  @ApiModelProperty({
    description: "User Id",
    required: true,
    example: "7d8c6f10-3eaf-4173-a7c6-f817ebfa71fa",
  })
  userId!: string;

}
