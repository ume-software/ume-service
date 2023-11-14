import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Admin Get Total User Response",
})
export class AdminGetTotalUserResponse {
    @ApiModelProperty({
        description: "Total User",
        example: 44,
    })
    totalUser!: number;

    @ApiModelProperty({
        description: "Total User Is Banned",
        example: 7,
    })
    totalUserIsBanned!: number;

    @ApiModelProperty({
        description: "Total User Is Verified",
        example: 28,
    })
    totalUserIsVerified!: number;
}
