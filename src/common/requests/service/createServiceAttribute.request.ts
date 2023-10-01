import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { CreateServiceAttributeValueRequest } from "./createServiceAttributeValue.request";

@ApiModel({
    description: "Create service attribute request",
})
export class CreateServiceAttributeRequest {
    @ApiModelProperty({
        description: "Service attribute",
        required: true,
        example: "Rank",
    })
    @IsString()
    attribute!: string;

    @ApiModelProperty({
        description: "Service attribute (VI)",
        required: false,
        example: "Hạng",
    })
    @IsOptional()
    @IsString()
    viAttribute?: string;

    @ApiModelProperty({
        description: "Is activated",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActivated?: boolean;

    @ApiModelProperty({
        description: "Create Service Attribute Value Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: CreateServiceAttributeValueRequest,
    })
    @IsOptional()
    @IsArray()
    serviceAttributeValues!: Array<CreateServiceAttributeValueRequest>;

    constructor(data: CreateServiceAttributeRequest) {
        if (data) {
            if (!data.serviceAttributeValues) data.serviceAttributeValues = [];
            data.serviceAttributeValues = data.serviceAttributeValues.map(
                (serviceAttributeValue: CreateServiceAttributeValueRequest) => {
                    return new CreateServiceAttributeValueRequest(
                        serviceAttributeValue
                    );
                }
            );
            Object.assign(
                this,
                mappingDataRequest(CreateServiceAttributeRequest, data, [
                    "attribute",
                    "viAttribute",
                    "isActivated",
                    "serviceAttributeValues",
                ])
            );
        }
    }
}
