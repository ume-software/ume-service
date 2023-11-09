import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { WithdrawRequestStatus } from "@prisma/client";

@ApiModel({
    description: "Get QR deposit request",
})
export class AdminHandleWithdrawRequest {
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
        description: "WithdrawRequestStatus",
        required: true,
        enum: Object.values([
            WithdrawRequestStatus.COMPLETED,
            WithdrawRequestStatus.REJECTED,
        ]),
        example: WithdrawRequestStatus.COMPLETED,
    })
    @IsEnum(WithdrawRequestStatus)
    public status!: WithdrawRequestStatus;

    constructor(data: AdminHandleWithdrawRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(AdminHandleWithdrawRequest, data, [
                    "id",
                    "billImageUrl",
                    "feedback",
                    "status",
                ])
            );
        }
    }
}
