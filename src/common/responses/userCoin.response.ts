import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInfomationResponse } from "./userInfomation.reponse";

@ApiModel({
  description: "Skill response",
})
export class UserCoinResponse {
  @ApiModelProperty({
    description: "User infomation",
    required: true,
    model: UserInfomationResponse,
  })
  userInfomation?: UserInfomationResponse;

  @ApiModelProperty({
    description: "Total coin of user",
    required: true,
    example: 1000,
  })
  totalCoin!: number;
}
