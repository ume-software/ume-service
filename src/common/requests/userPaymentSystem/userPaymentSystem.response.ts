import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

import { IsEnum, IsString } from "class-validator";
import { mappingDataRequest } from "../base";
import { PaymentSystemPlatform } from "@prisma/client";

@ApiModel({
    description: "Create new post request",
})
export class UserPaymentSystemRequest {
    userId!: string;
    @ApiModelProperty({
        description: "platform",
        required: true,
        example: PaymentSystemPlatform.BIDV,
        enum: Object.values(PaymentSystemPlatform),
    })
    @IsEnum(PaymentSystemPlatform)
    platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: "platformAccount",
        required: true,
        example: "124512315123",
    })
    @IsString()
    platformAccount!: string;

    @ApiModelProperty({
        description: "beneficiary",
        required: true,
        example: "DO TRAN MINH CHU",
    })
    @IsString()
    beneficiary!: string;

    constructor(data: UserPaymentSystemRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UserPaymentSystemRequest, data, [
                    "userId",
                    "platform",
                    "platformAccount",
                    "beneficiary",
                ])
            );
        }
    }
}
