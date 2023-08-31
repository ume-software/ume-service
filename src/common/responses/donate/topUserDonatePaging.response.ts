import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { TopUserDonateResponse } from "./topUserDonate.response";


@ApiModel({
  description: "Top user donate response",
})
export class TopUserDonatePagingResponse {
  @ApiModelProperty({
    description: "Row",

    type: SwaggerDefinitionConstant.ARRAY,
    itemType: TopUserDonateResponse,
  })
  row!: Array<TopUserDonateResponse>;
}
