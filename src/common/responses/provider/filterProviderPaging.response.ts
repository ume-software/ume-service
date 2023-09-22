import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { FilterProviderResponse } from "./filterProvider.response";
import { PaginationResponse } from "../base";


@ApiModel({
  description: "Filter provider paging response",
})
export class FilterProviderPagingResponse {
  @ApiModelProperty({
    description: "Row",
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: FilterProviderResponse,
  })
  row!: Array<FilterProviderResponse>;

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
