import { DepositRequestStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID, IsUrl } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Get QR deposit request",
})
export class DepositHandleRequest {
    @ApiModelProperty({
        description: "id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    public id?: string;

    @ApiModelProperty({
        description: "billImageUrl",
        required: false,
        example: "url",
    })
    @IsOptional()
    @IsUrl()
    public billImageUrl?: string;

    @ApiModelProperty({
        description: "feedback",
        required: false,
        example: "feedback",
    })
    @IsOptional()
    @IsString()
    public feedback?: string;

    @ApiModelProperty({
        description: "DepositRequestStatus",
        required: true,
        enum: Object.values([
            DepositRequestStatus.APPROVED,
            DepositRequestStatus.REJECTED,
        ]),
        example: DepositRequestStatus.APPROVED,
    })
    @IsEnum(DepositRequestStatus)
    public status!: DepositRequestStatus;

    constructor(data: DepositHandleRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(DepositHandleRequest, data, [
                    "id",
                    "billImageUrl",
                    "feedback",
                    "status"
                ])
            );
        }
    }
}
