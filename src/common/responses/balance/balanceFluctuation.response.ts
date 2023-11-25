import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Balance Fluctuation Response",
})
export class BalanceFluctuationResponse {
    @ApiModelProperty({
        description: "User id",
        required: true,
        example: -900,
    })
    expenses?: string;

    @ApiModelProperty({
        description: "Total balances available of user",
        required: true,
        example: 900,
    })
    income!: number;

    @ApiModelProperty({
        description: "Total balance of user",
        required: true,
        example: "2023-05-10T07:08:46.083Z",
    })
    time!: Date;
}
