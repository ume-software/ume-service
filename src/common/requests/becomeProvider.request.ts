import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "User registor become provider",
})
export class BecomeProviderRequest {
  @ApiModelProperty({
    description: "Slug url",
    required: true,
    example: "do_tran_minh_chu",
  })
  slug!: string;

  @ApiModelProperty({
    description: "Display name of provider",
    required: true,
    example: "Đỗ Trần Minh Chu",
  })
  name!: string;

  @ApiModelProperty({
    description: "Avatart Url of provider",
    required: true,
    example: "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
  })
  avatarUrl!: string;

  @ApiModelProperty({
    description: "Url mp3",
    required: true,
    example: "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
  })
  voiceUrl!: string;

  @ApiModelProperty({
    description: "Description",
    required: true,
    example: "This is description about me <3",
  })
  description!: string;
}
