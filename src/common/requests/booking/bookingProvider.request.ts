import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Booking cost provider skill request",
})
export class BookingProviderRequest {
    @ApiModelProperty({
        description: "Provider Skill Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    providerSkillId!: string;

    @ApiModelProperty({
        description: "Booking peroid",
        required: true,
        example: 2,
    })
    @Min(1)
    @Max(24)
    @IsInt()
    bookingPeriod!: number;

    @ApiModelProperty({
        description: "Voucher ids",
        required: false,
        example: ["42ac81c2-1815-45f7-b598-412487161e1f"],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    voucherIds!: Array<String>;

    constructor(data: BookingProviderRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(BookingProviderRequest, data, [
                    "providerSkillId",
                    "bookingPeriod",
                    "voucherIds",
                ])
            );
        }
    }
}
