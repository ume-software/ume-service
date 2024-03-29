import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: 'Renew token response`'
})
export class RenewTokenResponse {
    @ApiModelProperty({
        description: 'Access Token',
        required: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    })
    public accessToken?: string;
}
