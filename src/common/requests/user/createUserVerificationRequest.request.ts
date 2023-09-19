import { Gender } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsUrl } from "class-validator";
@ApiModel({
    description: "Update user profile request",
})
export class CreateUserVerificationRequest {
    @ApiModelProperty({
        description: "name",
        required: true,
        example: "name",
    })
    @IsUrl()
    public frontSideCitizenIdImageUrl!: string;

    @ApiModelProperty({
        description: "slug",
        required: true,
        example: "slug",
    })
    @IsUrl()
    public backSideCitizenIdImageUrl!: string;

    @ApiModelProperty({
        description: "gender",
        required: true,
        enum: Object.values(Gender),
        example: Gender.FEMALE,
    })
    @IsUrl()
    public portraitImageUrl!: string;

    constructor(data: CreateUserVerificationRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateUserVerificationRequest, data, [
                    "frontSideCitizenIdImageUrl",
                    "backSideCitizenIdImageUrl",
                    "portraitImageUrl",
                ])
            );
        }
    }
}
