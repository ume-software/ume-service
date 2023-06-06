
import { BuyCoinRequestStatus } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: 'Get QR buy coin request'
})
export class BuyCoinHandleRequest {
    @ApiModelProperty({
        description: 'id',
        required: false,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    public id?: string;

    @ApiModelProperty({
        description: 'billImageUrl',
        required: false,
        example: "url",
    })
    public billImageUrl?: string;

    @ApiModelProperty({
        description: 'feedback',
        required: false,
        example: "feedback",
    })
    public feedback?: string;



    @ApiModelProperty({
        description: 'BuyCoinRequestStatus',
        required: true,
        enum: Object.values([BuyCoinRequestStatus.APPROVED, BuyCoinRequestStatus.REJECTED]),
        example: BuyCoinRequestStatus.APPROVED,
    })
    public status!: BuyCoinRequestStatus;


}

