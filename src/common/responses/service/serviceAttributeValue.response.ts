import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
@ApiModel({
    description: " service attribute value response",
})
export class ServiceAttributeValueResponse {
    @ApiModelProperty({
        description: "Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    id!: string;

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

    @ApiModelProperty({
        description: "Service Attribute Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    serviceAttributeId!: string;

    // @ApiModelProperty({
    //     description: "serviceAttribute",
    //     required: false,
    //     model: ServiceAttributeResponse,
    // })
    // serviceAttribute!: ServiceAttributeResponse;
}
