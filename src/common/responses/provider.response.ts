import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { ProviderSkillResponse } from "./providerSkill.response";
import { UserInformationResponse } from "./userInformation.response";


@ApiModel({
  description: "Provider response",
})
export class ProviderResponse {
  @ApiModelProperty({
    description: "Id's provider",
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
    description: "Deleted At",
    example: null,
  })
  deletedAt!: Date;

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
    description: "Display name of provider",
    required: true,
    example: "Đỗ Trần Minh Chu",
  })
  name!: string;

  @ApiModelProperty({
    description: "Avatart Url of provider",
    required: true,
    example:
      "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
  })
  avatarUrl!: string;

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
    description: "providerSkills",
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: ProviderSkillResponse,
  })
  providerSkills!: Array<ProviderSkillResponse>;

  @ApiModelProperty({
    description: "providerSkills",
    example: {
      "dob": "2023-04-06T23:18:06.604Z",
      "name": "Christine Gutmann",
      "slug": "christine-gutmann",
      "gender": "MALE"
    },
    model: UserInformationResponse
  })
  user!: UserInformationResponse;
}
