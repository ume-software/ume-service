import { PaymentSystemPlatform } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsEnum, IsNumber, IsString } from "class-validator";

@ApiModel({
    description: "Get Qr BuyCoin request",
})
export class GetQrBuyCoinRequest {
    @ApiModelProperty({
        description: "Amount",
        required: true,
        example: 20000,
    })
    @IsNumber()
    public amount!: number;

    @ApiModelProperty({
        description: "platform",
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO,
    })
    @IsEnum(PaymentSystemPlatform)
    public platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: "transferContent",
        required: true,
        example: "abc - 123",
    })
    @IsString()
    public transferContent!: string;

    constructor(data: GetQrBuyCoinRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(GetQrBuyCoinRequest, data, [
                    "amount",
                    "platform",
                    "transferContent",
                ])
            );
        }
    }
}
