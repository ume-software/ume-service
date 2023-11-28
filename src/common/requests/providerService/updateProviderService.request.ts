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
import { HandleProviderServiceAttributeRequest } from "./handleProviderServiceAttribute.request";

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
        description: "Position",
        required: false,
        example: 8,
    })
    @Min(1)
    @IsInt()
    position?: number;

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
    @IsObject({ each: true })
    handleBookingCosts!: BookingCostProviderServiceRequest[];

    @ApiModelProperty({
        description: "Handle Provider Service Attributes",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: HandleProviderServiceAttributeRequest,
    })
    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    handleProviderServiceAttributes!: HandleProviderServiceAttributeRequest[];

    constructor(data: UpdateProviderServiceRequest) {
        if (data) {
            if (!data.handleProviderServiceAttributes)
                data.handleProviderServiceAttributes = [];
            Object.assign(
                this,
                mappingDataRequest(UpdateProviderServiceRequest, data, [
                    "serviceId",
                    "position",
                    "defaultCost",
                    "description",
                    "handleBookingCosts",
                    "handleProviderServiceAttributes",
                ])
            );
        }
    }
}
