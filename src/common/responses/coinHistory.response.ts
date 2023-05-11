import { CoinType } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "Coin History response",
})
export class CoinHistoryResponse {
  @ApiModelProperty({
    description: "Id's provider",
    required: true,
    example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
  })
  id!: string;

  @ApiModelProperty({
    description: "Created At",
    example: "2023-05-10T07:08:46.083Z",
  })
  createdAt!: Date;

  @ApiModelProperty({
    description: "Update At",
    example: "2023-05-10T07:08:46.083Z",
  })
  updatedAt!: Date;

  @ApiModelProperty({
    description: "Deleted At",
    example: null,
  })
  deletedAt!: Date;

  @ApiModelProperty({
    description: "Id's user",
    required: true,
    example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
  })
  userId!: string;

  @ApiModelProperty({
    description: "Slug url",
    required: true,
    example: CoinType.BUY_COIN,
  })
  coinType!: CoinType;

  @ApiModelProperty({
    description: "Amount",
    required: true,
    example: 10,
  })
  amount!: number;

  @ApiModelProperty({
    description: "Id of creator this history",
    required: false,
    example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
  })
  createdId?: string;
}
