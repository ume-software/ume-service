import { AdminRoleType } from "@prisma/client";
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiModel({
    description: 'Admin role response`'
})
export class AdminRoleResponse {
    @ApiModelProperty({
        description: "Id's provider",
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
        description: "Admin id",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    adminId!: string;

    @ApiModelProperty({
        description: 'password',
        required: true,
        enum: Object.values(AdminRoleType),
        type: SwaggerDefinitionConstant.STRING,
        example: AdminRoleType.COLLABORATOR
    })
    roleType!: AdminRoleType
}
