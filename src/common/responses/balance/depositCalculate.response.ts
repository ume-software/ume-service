import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Deposit calculate response",
})
export class DepositCalculateResponse {
    @ApiModelProperty({
        description: "AmountBalance",
        required: true,
        example: 20,
    })
    public amountBalance!: number;

    @ApiModelProperty({
        description: "platform",
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO,
    })
    public platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: "unitCurrency",
        required: true,
        enum: Object.values(UnitCurrency),
        example: UnitCurrency.VND,
    })
    public unitCurrency!: UnitCurrency;

    @ApiModelProperty({
        description: "Amount money",
        required: true,
        example: 30000,
    })
    amountMoney!: number;

    @ApiModelProperty({
        description: "Total fee",
        required: true,
        example: 30,
    })
    totalFee!: number;

    @ApiModelProperty({
        description: "Total money",
        required: true,
        example: 30030,
    })
    totalMoney!: number;
}
