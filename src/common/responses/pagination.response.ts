import { ApiModelProperty } from "express-swagger-typescript";

export class PaginationResponse {
  @ApiModelProperty({
    description: "Current page",
    example: 2,
  })
  currentPage!: number;

  @ApiModelProperty({
    description: "Next page",
    example: 3,
  })
  nextPage!: number;

  @ApiModelProperty({
    description: "Previous page",
    example: null,
  })
  prevPage!: 1;

  @ApiModelProperty({
    description: "Limit",
    example: 50,
  })
  limit!: number | string;
}
