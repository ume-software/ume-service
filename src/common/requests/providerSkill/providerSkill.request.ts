import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostProviderSkillRequest } from "./bookingCostProviderSkill.request";
import {
    IsArray,
    IsInt,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Provider skill request",
})
export class ProviderSkillRequest {
    @ApiModelProperty({
        description: "Skill Id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    @IsUUID()
    skillId!: string;

    @ApiModelProperty({
        description: "Default cost",
        required: true,
        example: 8,
    })
    @IsInt()
    defaultCost!: number;

    @ApiModelProperty({
        description: "Provider skill description",
        required: false,
        example: "Play with me :>>",
    })
    @IsOptional()
    @IsString()
    description!: string;

    @ApiModelProperty({
        description: "Booking Cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingCostProviderSkillRequest,
        example: [
            {
                startTimeOfDay: "09:00",
                endTimeOfDay: "15:00",
                amount: 10,
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @IsObject()
    createBookingCosts!: BookingCostProviderSkillRequest[];

    constructor(data: ProviderSkillRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(ProviderSkillRequest, data, [
                    "skillId",
                    "defaultCost",
                    "description",
                    "createBookingCosts",
                ])
            );
        }
    }
}
