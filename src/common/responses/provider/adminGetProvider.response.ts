import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ProviderServiceResponse } from "../providerService";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Provider response",
})
export class AdminGetProviderResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Id's user",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    userId!: string;

    @ApiModelProperty({
        description: "Slug url",
        required: true,
        example: "do_tran_minh_chu",
    })
    slug!: string;

    @ApiModelProperty({
        description: "Đỗ Trần Minh Chu",
        required: true,
        example: 10,
    })
    name!: string;

    @ApiModelProperty({
        description: "Avatar url",
        required: true,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    avatarUrl?: string;

    @ApiModelProperty({
        description: "Avatar url",
        required: true,
        example:
            "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
    })
    voiceUrl?: string;

    @ApiModelProperty({
        description: "Description",
        required: true,
        example: "This is description about me <3",
    })
    description?: string;

    @ApiModelProperty({
        description: "Cost",
        required: true,
        example: 6,
    })
    cost?: number;

    @ApiModelProperty({
        description: "providerServices",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProviderServiceResponse,
    })
    providerServices!: Array<ProviderServiceResponse>;

    @ApiModelProperty({
        description: "providerServices",
        example: {
            dob: "2023-04-06T23:18:06.604Z",
            name: "Christine Gutmann",
            slug: "christine-gutmann",
            gender: "MALE",
        },
        model: UserInformationResponse,
    })
    user!: UserInformationResponse;
}
