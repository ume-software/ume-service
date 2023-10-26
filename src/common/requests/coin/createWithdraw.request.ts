import { UnitCurrency } from "@prisma/client";
import { IsEnum, IsInt, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create Sell coin request",
})
export class CreateWithdrawRequest {
    @ApiModelProperty({
        description: "AmountCoin",
        required: true,
        example: 20,
    })
    @IsInt()
    amountCoin!: number;

    @ApiModelProperty({
        description: "unitCurrency",
        required: true,
        enum: Object.values(UnitCurrency),
        example: UnitCurrency.VND,
    })
    @IsEnum(UnitCurrency)
    unitCurrency!: UnitCurrency;

    @ApiModelProperty({
        description: "userPaymentSystemId",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    userPaymentSystemId!: string;

    constructor(data: CreateWithdrawRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateWithdrawRequest, data, [
                    "amountCoin",
                    "unitCurrency",
                    "userPaymentSystemId",
                ])
            );
        }
    }
}
