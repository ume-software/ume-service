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
} from "class-validator";
import { mappingDataRequest } from "../base";
import { CreateProviderServiceAttributeRequest } from "../service/createProviderServiceAttribute.request";

@ApiModel({
    description: "Provider service request",
})
export class ProviderServiceRequest {
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
        description: "Booking Cost",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingCostProviderServiceRequest,
    })
    @IsOptional()
    @IsArray()
    @IsObject()
    createBookingCosts?: BookingCostProviderServiceRequest[];

    @ApiModelProperty({
        description: "Create Provider Service Attribute Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: CreateProviderServiceAttributeRequest,
    })
    @IsOptional()
    @IsArray()
    @IsObject()
    createServiceAttributes?: CreateProviderServiceAttributeRequest[];

    constructor(data: ProviderServiceRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(ProviderServiceRequest, data, [
                    "serviceId",
                    "defaultCost",
                    "description",
                    "createBookingCosts",
                    "createServiceAttributes",
                ])
            );
        }
    }
}
