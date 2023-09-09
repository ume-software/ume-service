import { PaymentSystemPlatform } from "@prisma/client";
import { IsEnum, IsInt } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Get Qr Deposit request",
})
export class GetQrDepositRequest {
    @ApiModelProperty({
        description: "Amount",
        required: true,
        example: 20000,
    })
    @IsInt()
    public amount!: number;

    @ApiModelProperty({
        description: "platform",
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO,
    })
    @IsEnum(PaymentSystemPlatform)
    public platform!: PaymentSystemPlatform;

    constructor(data: GetQrDepositRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(GetQrDepositRequest, data, [
                    "amount",
                    "platform",
                ])
            );
        }
    }
}
