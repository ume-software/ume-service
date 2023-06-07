import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "./pagination.response";
import { BookingHistoryResponse } from "./bookingHistory.reponse";

@ApiModel({
  description: "Booking History response",
})
export class BookingHistoryPagingResponse {
  @ApiModelProperty({
    description: "Row",
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: BookingHistoryResponse,
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
