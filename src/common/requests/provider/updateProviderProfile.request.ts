import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { ProviderStatus } from "@prisma/client";

@ApiModel({
    description: "User update provider profile",
})
export class UpdateProviderProfileRequest {
    userId!: string;

    @ApiModelProperty({
        description: "Url mp3",
        required: false,
        example:
            "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
    })
    @IsOptional()
    @IsString()
    voiceUrl!: string;

    @ApiModelProperty({
        description: "Description",
        required: false,
        example: ProviderStatus.ACTIVATED,
        enum: Object.values(ProviderStatus),
    })
    @IsOptional()
    @IsEnum(ProviderStatus)
    status!: ProviderStatus;

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
                    "userId",
                    "description",
                    "voiceUrl",
                    "status",
                ])
            );
        }
    }
}
