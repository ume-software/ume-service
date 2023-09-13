import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { UserInformationResponse } from "./userInformation.response";
import { PaginationResponse } from "../base";


@ApiModel({
  description: "Top donate provider response",
})
export class UserInformationPagingResponse {
  @ApiModelProperty({
    description: "Row",

    type: SwaggerDefinitionConstant.ARRAY,
    itemType: UserInformationResponse,
  })
  row!: Array<UserInformationResponse>;

  @ApiModelProperty({
    description: "Count",
    example: 100,
  })
  count!: number;

  @ApiModelProperty({
    description: "Pagination",
    example: {
      currentPage: 2,
      nextPage: 3,
      prevPage: 1,
      limit: 2,
    },
    model: PaginationResponse,
  })
  pagination!: PaginationResponse;
}
