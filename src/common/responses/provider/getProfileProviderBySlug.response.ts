import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { ProviderServiceResponse } from "../providerService";
import { UserInformationResponse } from "../user";


@ApiModel({
  description: "Provider response",
})
export class GetProfileProviderBySlugResponse {
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
    example: "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png"
  })
  avatarUrl?: string;

  @ApiModelProperty({
    description: "Avatar url",
    required: true,
    example: "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3"
  })
  voiceUrl?: string;

  @ApiModelProperty({
    description: "Description",
    required: true,
    example: "This is description about me <3"
  })
  description?: string;

  @ApiModelProperty({
    description: "Cost",
    required: true,
    example: 6
  })
  cost?: number;

  @ApiModelProperty({
    description: "providerServices",
    example: [
      {
        id: "0c261207-3e82-4d56-a261-32175b797a78",
        createdAt: "2023-05-12T07:22:58.960Z",
        updatedAt: "2023-05-12T07:22:58.960Z",
        deletedAt: null,
        userId: "b3c475e9-1e49-4c53-9438-a527924aed6b",
        slug: "do_tran_minh_chu",
        name: "Đỗ Trần Minh Chu",
        avatarUrl:
          "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
        voiceUrl:
          "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
        description: "This is description about me <3",
        providerServices: [
          {
            id: "42ac81c2-1815-45f7-b598-412487161e1f",
            createdAt: "2023-05-12T07:31:19.794Z",
            updatedAt: "2023-05-12T07:31:19.794Z",
            deletedAt: null,
            providerId: "0c261207-3e82-4d56-a261-32175b797a78",
            serviceId: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
            defaultCost: 8,
            position: 1,
            bookingCosts: [
              {
                id: "2b44a08f-bfff-45dc-91e3-7ce7fcc4b779",
                createdAt: "2023-05-29T17:23:02.528Z",
                updatedAt: "2023-05-29T17:23:02.528Z",
                deletedAt: null,
                providerServiceId: "cdd1d441-0002-4c8f-ac64-d83d723c9656",
                startTimeOfDay: "00:00",
                endTimeOfDay: "12:00",
                amount: 64
              }
            ],
            service: {
              id: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
              createdAt: "2023-05-12T07:18:27.100Z",
              updatedAt: "2023-05-12T07:18:27.100Z",
              deletedAt: null,
              name: "Liên Minh Huyền Thoại",
              imageUrl:
                "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
            },
          },
        ],
      },
    ],
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: ProviderServiceResponse,
  })
  providerServices!: Array<ProviderServiceResponse>;

  @ApiModelProperty({
    description: "providerServices",
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
