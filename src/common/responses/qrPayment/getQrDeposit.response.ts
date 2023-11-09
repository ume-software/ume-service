import { PaymentSystemPlatform } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Get Qr Deposit request",
})
export class GetQrDepositResponse {
    @ApiModelProperty({
        description: "Amount",
        required: true,
        example: 20000,
    })
    public amount!: number;

    @ApiModelProperty({
        description: "platform",
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO,
    })
    public platform!: PaymentSystemPlatform;
}
