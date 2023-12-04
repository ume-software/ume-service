import { Gender, ProviderStatus } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Filter Provider response",
})
export class FilterProviderResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

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
        required: false,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    avatarUrl?: string;

    @ApiModelProperty({
        description: "Avatar url",
        required: false,
        example:
            "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
    })
    voiceUrl?: string;

    @ApiModelProperty({
        description: "Description",
        required: false,
        example: "This is description about me <3",
    })
    description?: string;

    @ApiModelProperty({
        description: "Cost",
        required: false,
        example: 6,
    })
    cost?: number;
    @ApiModelProperty({
        description: "Provider service Id",
        required: false,
        example: "45cc1d82-644b-4f7a-b474-7492b2575f10",
    })
    providerServiceId?: string;

    @ApiModelProperty({
        description: "Service Id",
        required: false,
        example: "45cc1d82-644b-4f7a-b474-7492b2575f10",
    })
    serviceId?: string;

    @ApiModelProperty({
        description: "Service slug",
        required: false,
        example: "lien-minh-huyen-thoai",
    })
    serviceSlug?: string;

    @ApiModelProperty({
        description: "Service name",
        required: false,
        example: "Liên Minh Huyền Thoại",
    })
    serviceName?: string;

    @ApiModelProperty({
        description: "Service image url",
        required: false,
        example: "Liên Minh Huyền Thoại",
    })
    serviceImageUrl?: string;

    @ApiModelProperty({
        description: "Gender",
        required: false,
        example: Gender.OTHER,
    })
    gender?: Gender;

    @ApiModelProperty({
        description: "dob",
        required: false,
        example: "2001-05-26T02:09:38.810Z",
    })
    dob?: string;

    @ApiModelProperty({
        description: "star",
        required: false,
        example: 4.9,
    })
    star?: number;

    @ApiModelProperty({
        description: "isOnline",
        required: false,
        example: 4.9,
    })
    isOnline?: boolean;

    @ApiModelProperty({
        description: "provider status",
        required: true,
        enum: Object.values(ProviderStatus),
    })
    providerStatus?: ProviderStatus;
}
