import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { IsEnum, IsInt } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Get QR buy coin request",
})
export class CreateBuyCoinRequest {
    @ApiModelProperty({
        description: "AmountCoin",
        required: true,
        example: 20,
    })
    @IsInt()
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

    constructor(data: CreateBuyCoinRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateBuyCoinRequest, data, [
                    "amountCoin",
                    "platform",
                    "unitCurrency",
                ])
            );
        }
    }
}
