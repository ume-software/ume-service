import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostProviderServiceRequest } from "./bookingCostProviderService.request";
import {
    IsArray,
    IsInt,
    IsObject,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from "class-validator";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Update provider service request",
})
export class UpdateProviderServiceRequest {
    @ApiModelProperty({
        description: "Service Id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    @IsUUID()
    serviceId!: string;

    @ApiModelProperty({
        description: "Default cost",
        required: true,
        example: 8,
    })
    @Min(1)
    @IsInt()
    defaultCost!: number;

    @ApiModelProperty({
        description: "Provider service description",
        required: false,
        example: "Play with me :>>",
    })
    @IsOptional()
    @IsString()
    description!: string;

    @ApiModelProperty({
        description: "Create booking cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingCostProviderServiceRequest,
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
    createBookingCosts!: BookingCostProviderServiceRequest[];

    @ApiModelProperty({
        description: "Update booking cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingCostProviderServiceRequest,
        example: [
            {
                id: "42ac81c2-1815-45f7-b598-412487161e1f",
                startTimeOfDay: "09:00",
                endTimeOfDay: "15:00",
                amount: 10,
            },
        ],
    })
    @IsOptional()
    @IsArray()
    @IsObject()
    updateBookingCosts!: BookingCostProviderServiceRequest[];

    @ApiModelProperty({
        description: "Create booking cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
        example: ["42ac81c2-1815-45f7-b598-412487161e1f"],
    })
    @IsOptional()
    @IsArray()
    @IsObject()
    deleteBookingCosts!: Array<String>;

    constructor(data: UpdateProviderServiceRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateProviderServiceRequest, data, [
                    "serviceId",
                    "defaultCost",
                    "description",
                    "createBookingCosts",
                    "updateBookingCosts",
                    "deleteBookingCosts",
                ])
            );
        }
    }
}
