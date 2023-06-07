import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "./pagination.response";
import { BookingHistoryResponse } from "./bookingHistory.reponse";

@ApiModel({
  description: "Coin History response",
})
export class CoinHistoryPagingResponse {
  @ApiModelProperty({
    description: "Row",
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: CoinHistoryPagingResponse,
  })
  row!: Array<BookingHistoryResponse>;

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
