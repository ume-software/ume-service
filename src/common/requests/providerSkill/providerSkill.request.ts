import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostProviderSkillRequest } from "./bookingCostProviderSkill.request";

@ApiModel({
    description: "Provider skill request",
})
export class ProviderSkillRequest {
    @ApiModelProperty({
        description: "Skill Id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    skillId!: string;

    @ApiModelProperty({
        description: "Default cost",
        required: true,
        example: 8,
    })
    defaultCost!: number;

    @ApiModelProperty({
        description: "Provider skill description",
        required: false,
        example: "Play with me :>>",
    })
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
    createBookingCosts!: BookingCostProviderSkillRequest[];

    constructor(data: ProviderSkillRequest) {
        this.createBookingCosts = data.createBookingCosts;
        this.defaultCost = data.defaultCost;
        this.description = data.description;
        this.skillId = data.skillId;
    }
}
