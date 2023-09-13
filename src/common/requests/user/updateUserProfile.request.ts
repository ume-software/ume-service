import { Gender } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
@ApiModel({
    description: "Update user profile request",
})
export class UpdateUserProfileRequest {
    @ApiModelProperty({
        description: "name",
        required: false,
        example: "name",
    })
    @IsOptional()
    @IsString()
    public name!: string | null;

    @ApiModelProperty({
        description: "slug",
        required: false,
        example: "slug",
    })
    @IsOptional()
    @IsString()
    public slug!: string | null;

    @ApiModelProperty({
        description: "gender",
        required: false,
        enum: Object.values(Gender),
        example: Gender.FEMALE,
    })
    @IsOptional()
    @IsEnum(Gender)
    public gender!: Gender;

    @ApiModelProperty({
        description: "day of birth",
        required: false,
        example: "2023-02-08T07:25:50.009Z",
    })
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    public dob!: Date | null;

    @ApiModelProperty({
        description: "avatar url",
        required: false,
        example:
            "https://lh3.googleusercontent.com/a/AAcHTtfxbwWNIPBNhWJ6V_oTzH_Ea6ocmhgs0uIpo8c6=s96-c",
    })
    @IsOptional()
    @IsString()
    public avatarUrl!: string | null;

    constructor(data: UpdateUserProfileRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateUserProfileRequest, data, [
                    "name",
                    "slug",
                    "gender",
                    "dob",
                    "avatarUrl",
                ])
            );
        }
    }
}
