import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostProviderSkillRequest } from "./bookingCostProviderSkill.request";

@ApiModel({
    description: "Update provider skill request",
})
export class UpdateProviderSkillRequest {
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
        description: "Create booking cost",
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

    @ApiModelProperty({
        description: "Update booking cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingCostProviderSkillRequest,
        example: [
            {
                id: "42ac81c2-1815-45f7-b598-412487161e1f",
                startTimeOfDay: "09:00",
                endTimeOfDay: "15:00",
                amount: 10,
            },
        ],
    })
    updateBookingCosts!: BookingCostProviderSkillRequest[];

    @ApiModelProperty({
        description: "Create booking cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
        example: ["42ac81c2-1815-45f7-b598-412487161e1f"],
    })
    deleteBookingCosts!: Array<String>;
}
