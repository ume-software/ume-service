import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "./pagination.response";
import { CoinHistoryResponse } from "./coinHistory.response";

@ApiModel({
  description: "Coin History response",
})
export class CoinHistoryPagingResponse {
  @ApiModelProperty({
    description: "Row",
    example: [
      {
        id: "c8b6a728-6db6-42e6-b050-92ab31ced664",
        createdAt: "2023-05-10T10:13:19.401Z",
        updatedAt: "2023-05-10T10:13:19.401Z",
        deletedAt: null,
        userId: "7d8c6f10-3eaf-4173-a7c6-f817ebfa71fa",
        coinType: "ADMIN",
        amount: 10,
        createdId: "c46c8037-0969-47d1-9337-e35571c87305",
      },
      {
        id: "f3ec70d2-549c-454f-b5bc-caf92f7240be",
        createdAt: "2023-05-10T10:14:38.564Z",
        updatedAt: "2023-05-10T10:14:38.564Z",
        deletedAt: null,
        userId: "7d8c6f10-3eaf-4173-a7c6-f817ebfa71fa",
        coinType: "ADMIN",
        amount: 10,
        createdId: "c46c8037-0969-47d1-9337-e35571c87305",
      },
    ],
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: CoinHistoryPagingResponse,
  })
  row!: Array<CoinHistoryResponse>;

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
