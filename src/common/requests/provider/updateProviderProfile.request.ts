import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "User update provider profile",
})
export class UpdateProviderProfileRequest {
    userId!: string;
    @ApiModelProperty({
        description: "Slug url",
        required: false,
        example: "do-tran-minh-chu",
    })
    @IsOptional()
    @IsString()
    slug!: string;

    @ApiModelProperty({
        description: "Display name of provider",
        required: false,
        example: "Đỗ Trần Minh Chu",
    })
    @IsOptional()
    @IsString()
    name!: string;

    @ApiModelProperty({
        description: "Avatart Url of provider",
        required: false,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    @IsOptional()
    @IsUrl()
    avatarUrl!: string;

    @ApiModelProperty({
        description: "Url mp3",
        required: false,
        example:
            "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
    })
    @IsOptional()
    @IsUrl()
    voiceUrl!: string;

    @ApiModelProperty({
        description: "Description",
        required: false,
        example: "This is description about me <3",
    })
    @IsOptional()
    @IsString()
    description!: string;

    constructor(data: UpdateProviderProfileRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateProviderProfileRequest, data, [
                    "avatarUrl",
                    "description",
                    "name",
                    "slug",
                    "voiceUrl",
                ])
            );
        }
    }
}
