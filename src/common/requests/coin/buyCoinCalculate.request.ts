import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Buy coin calculate request",
})
export class BuyCoinCalculateRequest {
    @ApiModelProperty({
        description: "AmountCoin",
        required: true,
        example: 20,
    })
    @IsNumber()
    public amountCoin!: number;

    @ApiModelProperty({
        description: "platform",
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO,
    })
    @IsEnum(PaymentSystemPlatform)
    public platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: "unitCurrency",
        required: true,
        enum: Object.values(UnitCurrency),
        example: UnitCurrency.VND,
    })
    @IsEnum(UnitCurrency)
    public unitCurrency!: UnitCurrency;

    constructor(data: BuyCoinCalculateRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(BuyCoinCalculateRequest, data, [
                    "amountCoin",
                    "platform",
                    "unitCurrency",
                ])
            );
        }
    }
}
