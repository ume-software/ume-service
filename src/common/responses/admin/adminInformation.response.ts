import { Gender } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { AdminRoleResponse } from "./adminRole.response";

@ApiModel({
    description: "User information reponse",
})
export class AdminInformationResponse {
    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "username",
        type: SwaggerDefinitionConstant.STRING,
    })
    public username!: string | null;

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public name!: string | null;

    @ApiModelProperty({
        description: "gender",
        required: true,
        enum: Object.values(Gender),
        example: Gender.FEMALE,
    })
    public gender!: Gender | null;

    @ApiModelProperty({
        description: "day of birth",
        required: true,
        type: SwaggerDefinitionConstant.DATE,
        example: "2023-02-08T07:25:50.009Z",
    })
    public dob!: Date | null;

    @ApiModelProperty({
        description: "phone",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public phone!: string | null;

    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public email!: string | null;

    @ApiModelProperty({
        description: "avatar url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
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
