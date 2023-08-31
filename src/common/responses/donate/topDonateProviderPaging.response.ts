import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { TopDonateProviderResponse } from "./topDonateProvider.response";

@ApiModel({
  description: "Top donate provider response",
})
export class TopDonateProviderPagingResponse {
  @ApiModelProperty({
    description: "Row",
 
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: TopDonateProviderResponse,
  })
  row!: Array<TopDonateProviderResponse>;
}
