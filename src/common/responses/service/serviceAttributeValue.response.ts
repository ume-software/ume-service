import { IsBoolean, IsOptional, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
@ApiModel({
    description: " service attribute value response",
})
export class ServiceAttributeValueResponse {
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
}
