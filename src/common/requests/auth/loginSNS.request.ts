import { LoginType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Login SNS request",
})
export class LoginSNSRequest {
    @ApiModelProperty({
        description: "SNS token, exmample google token, firebase token,...",
        required: true,
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    })
    @IsString()
    public token!: string;

    @ApiModelProperty({
        description: "SNS token, exmample google token, firebase token,...",
        required: true,
        enum: Object.values(LoginType),
        example: LoginType.GOOGLE,
    })
    @IsEnum(LoginType)
    public loginType!: LoginType;

    @IsString()
    @IsOptional()
    public ipv4!: string;

    constructor(data: LoginSNSRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(LoginSNSRequest, data, [
                    "token",
                    "loginType",
                    "ipv4",
                ])
            );
        }
    }
}
