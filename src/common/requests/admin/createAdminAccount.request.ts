import { AdminRoleType, Gender } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Create account request",
})
export class CreateAdminAccountRequest {
    @ApiModelProperty({
        description: "Fullname of user",
        required: true,
        example: "Do Tran Minh Chu",
    })
    public name!: string;

    @ApiModelProperty({
        description: `Day of birth by format YYYY-MM-DDTHH:mm:ssZ
        </br>
        Example : 2001-10-13T00:00:00+07:00`,
        required: false,
        example: "2001-10-13T00:00:00+07:00",
    })
    public dob?: Date;

    @ApiModelProperty({
        description: `Gender`,
        required: true,
        example: Gender.MALE,
    })
    public gender!: Gender;

    @ApiModelProperty({
        description: `Url avatar`,
        required: false,
        example:
            "https://haycafe.vn/wp-content/uploads/2022/02/anh-meo-cute-hinh-cute-meo.jpg",
    })
    public avatarUrl?: string;

    @ApiModelProperty({
        description: `Email`,
        required: false,
        example: "dotranminhchu@gmail.com",
    })
    public email?: string;

    @ApiModelProperty({
        description: `Phone number`,
        required: false,
        example: "0123456789",
    })
    public phone?: string;

    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "username",
    })
    public username!: string;

    @ApiModelProperty({
        description: "password",
        required: true,
    })
    public password!: string;

    @ApiModelProperty({
        description: "admin roles",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        enum: Object.values(AdminRoleType),
        itemType: SwaggerDefinitionConstant.STRING,
    })
    public roles!: Array<AdminRoleType>;

    constructor(data: CreateAdminAccountRequest) {
        this.name = data.name;
        this.dob = data.dob!;
        this.gender = data.gender;
        this.avatarUrl = data.avatarUrl!;
        this.email = data.email!;
        this.phone = data.phone!;
        this.username = data.username;
        this.password = data.password;
        this.roles = data.roles;
    }
}
