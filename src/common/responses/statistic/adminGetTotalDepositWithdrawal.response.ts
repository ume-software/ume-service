import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Admin get total deposit withdrawal response",
})
export class AdminGetTotalDepositWithdrawalResponse {
    @ApiModelProperty({
        description: "Total deposit",
        example: 44,
    })
    totalDeposit!: number;

    @ApiModelProperty({
        description: "Total withdrawal",
        example: 7,
    })
    totalWithdrawal!: number;
}
