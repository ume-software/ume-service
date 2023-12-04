import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Admin Get Total User Response",
})
export class AdminGetTotalUserResponse {
    @ApiModelProperty({
        description: "Total User",
        example: 54,
    })
    totalUser!: number;

    @ApiModelProperty({
        description: "Total User Is Banned",
        example: 33,
    })
    totalUserIsBanned!: number;

    @ApiModelProperty({
        description: "Total User Is Verified",
        example: 7,
    })
    totalUserIsVerified!: number;

    @ApiModelProperty({
        description: "Total user is banned and is verified",
        example: 5,
    })
    totalUserIsBannedAndIsVerified!: number;

    @ApiModelProperty({
        description: "Total user is banned and is not verified",
        example: 2,
    })
    totalUserIsBannedAndIsNotVerified!: number;

    @ApiModelProperty({
        description: "Total user is not banned and is verified",
        example: 28,
    })
    totalUserIsNotBannedAndIsVerified!: number;

    @ApiModelProperty({
        description: "Total user is not banned and is verified",
        example: 19,
    })
    totalUserIsNotBannedAndIsNotVerified!: number;
}
