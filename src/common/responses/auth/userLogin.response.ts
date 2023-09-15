import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Login response`",
})
export class UserLoginResponse {
    @ApiModelProperty({
        description: "Access Token",
        required: true,
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    })
    public accessToken?: string;

    @ApiModelProperty({
        description: "refresh Token",
        required: true,
        example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    })
    public refreshToken?: string;
    @ApiModelProperty({
        description: "User infomation",
        model: UserInformationResponse,
        required: true,
    })
    public user!: UserInformationResponse;

    @ApiModelProperty({
        description: "If is new account return isNewSignup is true",
        required: false,
        example: true,
    })
    public isNewSignup?: boolean;
}
