import { ProviderStatus } from "@prisma/client";
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiModel({
    description: "Provider config response",
})
export class ProviderConfigResponse {
    @ApiModelProperty({
        description: "Id's provider config",
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
        description: "Url mp3",
        required: true,
        example:
            "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
    })
    voiceUrl!: string;

    @ApiModelProperty({
        description: "Description",
        required: true,
        example: "This is description about me <3",
    })
    description!: string;

    @ApiModelProperty({
        description: "Description",
        required: true,
        example: ProviderStatus.BUSY,
        enum: Object.values(ProviderStatus),
    })
    status!: ProviderStatus;

    @ApiModelProperty({
        description: "isBanned",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    isBanned?: boolean;
}
