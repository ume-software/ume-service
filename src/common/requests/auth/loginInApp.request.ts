import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsString } from "class-validator";

@ApiModel({
    description: "Login request",
})
export class LoginInAppRequest {
    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "username",
    })
    @IsString()
    public username!: string;

    @ApiModelProperty({
        description: "password",
        required: true,
    })
    @IsString()
    public password!: string;

    constructor(data: LoginInAppRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(LoginInAppRequest, data, [
                    "username",
                    "password",
                ])
            );
        }
    }
}
