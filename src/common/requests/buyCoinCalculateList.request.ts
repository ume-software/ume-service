
import { PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiModel({
    description: 'Buy coin calculate list request'
})
export class BuyCoinCalculateListRequest {
    @ApiModelProperty({
        description: 'AmountCoin',
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.NUMBER,
        example: [20, 50, 100, 200, 500],
    })
    public amountCoins!: Array<number>;

    @ApiModelProperty({
        description: 'platform',
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO,
    })
    public platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: 'unitCurrency',
        required: true,
        enum: Object.values(UnitCurrency),
        example: UnitCurrency.VND,
    })
    public unitCurrency!: UnitCurrency;


}

