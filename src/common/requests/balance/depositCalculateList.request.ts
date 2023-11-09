import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { IsArray, IsEnum, IsInt } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Deposit calculate list request",
})
export class DepositCalculateListRequest {
    @ApiModelProperty({
        description: "amountBalance",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.NUMBER,
        example: [20, 50, 100, 200, 500],
    })
    @IsInt({ each: true })
    @IsArray()
    public amountBalance!: Array<number>;

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

    constructor(data: DepositCalculateListRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(DepositCalculateListRequest, data, [
                    "amountBalance",
                    "platform",
                    "unitCurrency",
                ])
            );
        }
    }
}
