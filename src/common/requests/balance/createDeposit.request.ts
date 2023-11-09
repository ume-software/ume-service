import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { IsEnum, IsInt } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Get QR deposit request",
})
export class CreateDepositRequest {
    @ApiModelProperty({
        description: "AmountBalance",
        required: true,
        example: 20,
    })
    @IsInt()
    public amountBalance!: number;

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

    constructor(data: CreateDepositRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateDepositRequest, data, [
                    "amountBalance",
                    "platform",
                    "unitCurrency",
                ])
            );
        }
    }
}
