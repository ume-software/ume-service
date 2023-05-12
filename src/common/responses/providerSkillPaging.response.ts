import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "./pagination.response";
import { ProviderSkillResponse } from "./providerSkill.response";

@ApiModel({
  description: "Coin History response",
})
export class CoinHistoryPagingResponse {
  @ApiModelProperty({
    description: "Row",
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
        providerSkills: [
          {
            id: "42ac81c2-1815-45f7-b598-412487161e1f",
            createdAt: "2023-05-12T07:31:19.794Z",
            updatedAt: "2023-05-12T07:31:19.794Z",
            deletedAt: null,
            providerId: "0c261207-3e82-4d56-a261-32175b797a78",
            skillId: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
            defaultCost: 8,
            position: 1,
            bookingCosts: [],
            skill: {
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
    itemType: ProviderSkillResponse,
  })
  rows!: Array<ProviderSkillResponse>;

  @ApiModelProperty({
    description: "Count",
    example: 100,
  })
  count!: number;

  @ApiModelProperty({
    description: "Pagination",
    example: {
      currentPage: 2,
      nextPage: 3,
      prevPage: 1,
      limit: 2,
    },
    model: PaginationResponse,
  })
  pagination!: PaginationResponse;
}
