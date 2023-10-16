import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { EHandleType } from "@/enums/handleType.enum";

@ApiModel({
    description: "Handle service attribute value request",
})
export class HandleServiceAttributeValueRequest {
    @ApiModelProperty({
        description: "Id",
        required: false,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    @IsString()
    @IsOptional()
    id?: string;

    @ApiModelProperty({
        description: "Service attribute value",
        required: false,
        example: "Hạng 1",
    })
    @IsString()
    @IsOptional()
    value!: string;

    @ApiModelProperty({
        description: "Service attribute value (VI)",
        required: false,
        example: "Cấp 1",
    })
    @IsOptional()
    @IsString()
    viValue!: string;

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

    constructor(data: HandleServiceAttributeValueRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(HandleServiceAttributeValueRequest, data, [
                    "id",
                    "value",
                    "viValue",
                    "isActivated",
                    "handleType",
                ])
            );
        }
    }
}
