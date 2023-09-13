import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsString } from "class-validator";

@ApiModel({
    description: "Renew token request",
})
export class RenewTokenRequest {
    @ApiModelProperty({
        description: "Refresh token",
        required: true,
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    })
    @IsString()
    public refreshToken!: string;

    constructor(data: RenewTokenRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(RenewTokenRequest, data, ["refreshToken"])
            );
        }
    }
}
