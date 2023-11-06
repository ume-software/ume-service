import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "User coin response",
})
export class UserBalanceResponse {
    @ApiModelProperty({
        description: "User id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    userId?: string;

    @ApiModelProperty({
        description: "Total coins available of user",
        required: true,
        example: 900,
    })
    totalBalanceAvailable!: number;

    @ApiModelProperty({
        description: "Total coin of user",
        required: true,
        example: 1000,
    })
    totalBalance!: number;
}
