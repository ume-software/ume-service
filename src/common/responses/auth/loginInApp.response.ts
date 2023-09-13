import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: 'Login response`'
})
export class LoginResponse {
    @ApiModelProperty({
        description: 'Access Token',
        required: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
    public accessToken?: string;

    @ApiModelProperty({
        description: 'Refreshe Token',
        required: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    })
    public refreshToken?: string;

    @ApiModelProperty({
        description: 'If is new account return isNewSignup is true',
        required: false,
        example: true
    })
    public isNewSignup?: boolean;
}
