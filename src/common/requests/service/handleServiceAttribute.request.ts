import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { EHandleType } from "@/enums/handleType.enum";
import { HandleServiceAttributeValueRequest } from "./handleServiceAttributeValue.request";

@ApiModel({
    description: "Handle service attribute request",
})
export class HandleServiceAttributeRequest {
    @ApiModelProperty({
        description: "Id",
        required: false,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    @IsString()
    id?: string;

    @ApiModelProperty({
        description: "Service attribute",
        required: false,
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
    viAttribute!: string;

    @ApiModelProperty({
        description: "Is activated",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActivated!: boolean;

    @ApiModelProperty({
        description: "Handle Type",
        required: true,
        enum: Object.values(EHandleType),
        example: EHandleType.UPDATE,
    })
    handleType!: EHandleType;

    @ApiModelProperty({
        description: "Create Service Attribute Value Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: HandleServiceAttributeValueRequest,
    })
    @IsOptional()
    serviceAttributeValues!: Array<HandleServiceAttributeValueRequest>;

    constructor(data: HandleServiceAttributeRequest) {
        if (data) {
            if (!data.serviceAttributeValues) data.serviceAttributeValues = [];
            data.serviceAttributeValues = data.serviceAttributeValues.map(
                (serviceAttributeValue: HandleServiceAttributeValueRequest) => {
                    return new HandleServiceAttributeValueRequest(
                        serviceAttributeValue
                    );
                }
            );
            Object.assign(
                this,
                mappingDataRequest(HandleServiceAttributeRequest, data, [
                    "id",
                    "attribute",
                    "viAttribute",
                    "isActivated",
                    "serviceAttributeValues",
                ])
            );
        }
    }
}
