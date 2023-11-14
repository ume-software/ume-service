import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { WithdrawalRequestStatus } from "@prisma/client";

@ApiModel({
    description: "Get QR deposit request",
})
export class AdminHandleWithdrawalRequest {
    @IsUUID()
    public id?: string;

    @ApiModelProperty({
        description: "billImageUrl",
        required: false,
        example: "url",
    })
    @IsOptional()
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
        description: "WithdrawalRequestStatus",
        required: true,
        enum: Object.values([
            WithdrawalRequestStatus.COMPLETED,
            WithdrawalRequestStatus.REJECTED,
        ]),
        example: WithdrawalRequestStatus.COMPLETED,
    })
    @IsEnum(WithdrawalRequestStatus)
    public status!: WithdrawalRequestStatus;

    constructor(data: AdminHandleWithdrawalRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(AdminHandleWithdrawalRequest, data, [
                    "id",
                    "billImageUrl",
                    "feedback",
                    "status",
                ])
            );
        }
    }
}
