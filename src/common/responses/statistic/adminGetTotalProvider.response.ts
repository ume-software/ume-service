import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Admin Get Total Provider Response",
})
export class AdminGetTotalProviderResponse {
    @ApiModelProperty({
        description: "Total User",
        example: 44,
    })
    totalProvider!: number;

    @ApiModelProperty({
        description: "Total Provider Is Banned",
        example: 7,
    })
    totalProviderIsBanned!: number;

    @ApiModelProperty({
        description: "Total Provider Is Verified",
        example: 28,
    })
    totalProviderIsVerified!: number;
}
