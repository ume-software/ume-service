import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create service attribute value request",
})
export class CreateServiceAttributeValueRequest {
    @ApiModelProperty({
        description: "Service attribute value",
        required: true,
        example: "Iron",
    })
    @IsString()
    value!: string;

    @ApiModelProperty({
        description: "Service attribute value (VI)",
        required: false,
        example: "Sắt",
    })
    @IsOptional()
    @IsString()
    viValue?: string;

    @ApiModelProperty({
        description: "Is activated",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActivated?: boolean;
    constructor(data: CreateServiceAttributeValueRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateServiceAttributeValueRequest, data, [
                    "value",
                    "viValue",
                    "isActivated",
                ])
            );
        }
    }
}
