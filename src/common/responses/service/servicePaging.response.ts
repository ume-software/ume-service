import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { ServiceResponse } from "./service.response";
import { PaginationResponse } from "../base";


@ApiModel({
  description: "Service Paging response",
})
export class ServicePagingResponse {
  @ApiModelProperty({
    description: "Row",
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: ServiceResponse,
  })
  row!: Array<ServiceResponse>;

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
