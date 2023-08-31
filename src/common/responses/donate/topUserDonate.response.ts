import {
  ApiModel,
  ApiModelProperty,
} from "express-swagger-typescript";
import { UserInformationResponse } from "../user";

@ApiModel({
  description: "Top donate provider response",
})
export class TopUserDonateResponse {


  @ApiModelProperty({
    description: "Total coin donate",
    example: 20,
  })
  totalCoinDonate!: number;

  @ApiModelProperty({
    description: "Count donate",
    example: 2,
  })
  countDonate!: number;


  @ApiModelProperty({
    description: "Provider id",
    example: "0c261207-3e82-4d56-a261-32175b797a78",
  })
  userId!: string;


  @ApiModelProperty({
    description: "User",
    model: UserInformationResponse
  })
  user!: UserInformationResponse;
}
