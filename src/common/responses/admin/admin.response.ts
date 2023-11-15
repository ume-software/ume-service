import { Gender } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { AdminRoleResponse } from "./adminRole.response";

@ApiModel({
    description: "Admin response",
})
export class AdminResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        example: null,
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "username",
        type: SwaggerDefinitionConstant.STRING,
    })
    public username!: string;

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public name!: string;

    @ApiModelProperty({
        description: "gender",
        required: true,
        enum: Object.values(Gender),
        example: Gender.FEMALE,
    })
    public gender!: Gender;

    @ApiModelProperty({
        description: "day of birth",
        required: true,
        type: SwaggerDefinitionConstant.DATE,
        example: "2023-02-08T07:25:50.009Z",
    })
    public dob!: Date;

    @ApiModelProperty({
        description: "phone",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public phone!: string;

    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public email!: string;

    @ApiModelProperty({
        description: "avatar url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    public avatarUrl!: string;

    @ApiModelProperty({
        description: "Is Activated",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: true,
    })
    public isActivated!: boolean;

    @ApiModelProperty({
        description: "adminRoles",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AdminRoleResponse,
        required: false,
    })
    adminRoles?: Array<AdminRoleResponse>;
}
