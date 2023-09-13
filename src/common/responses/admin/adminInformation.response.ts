import { Gender } from "@prisma/client"
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { AdminRoleResponse } from "./adminRole.response";

@ApiModel({
    description: 'User information reponse'
})
export class AdminInformationResponse {
    @ApiModelProperty({
        description: 'The username for login',
        required: true,
        example: 'username',
    })
    public username!: string | null;

    @ApiModelProperty({
        description: 'name',
        required: true,
    })
    public name!: string | null;

    @ApiModelProperty({
        description: 'gender',
        required: true,
    })
    public gender!: Gender | null;

    @ApiModelProperty({
        description: 'day of birth',
        required: true,
    })
    public dob!: Date | null;

    @ApiModelProperty({
        description: 'phone',
        required: true,
    })
    public phone!: string | null;

    @ApiModelProperty({
        description: 'email',
        required: true,
    })
    public email!: string | null;


    @ApiModelProperty({
        description: 'avatar url',
        required: true,
    })
    public avatarUrl!: string | null;


    @ApiModelProperty({
        description: "adminRoles",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AdminRoleResponse,
        required: false,
    })
    adminRoles?: Array<AdminRoleResponse>;
}
