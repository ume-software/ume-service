import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Booking cost provider skill request",
})
export class BookingProviderRequest {
    @ApiModelProperty({
        description: "Provider Skill Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    providerSkillId!: string;

    @ApiModelProperty({
        description: "Booking peroid",
        required: true,
        example: 2,
    })
    bookingPeriod!: number;

    @ApiModelProperty({
        description: "Voucher ids",
        required: false,
        example: ["42ac81c2-1815-45f7-b598-412487161e1f"],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    voucherIds!: Array<String>;
}
