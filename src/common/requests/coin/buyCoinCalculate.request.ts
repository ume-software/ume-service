import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Buy coin calculate request",
})
export class BuyCoinCalculateRequest {
    @ApiModelProperty({
        description: "AmountCoin",
        required: true,
        example: 20,
    })
    public amountCoin!: number;

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

    constructor(data: BuyCoinCalculateRequest) {
        this.amountCoin = data.amountCoin;
        this.platform = data.platform;
        this.unitCurrency = data.unitCurrency;
    }
}
