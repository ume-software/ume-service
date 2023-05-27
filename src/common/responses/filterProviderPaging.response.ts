import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "./pagination.response";
import { FilterProviderResponse } from "./filterProvider.response";


@ApiModel({
  description: "Filter provider paging response",
})
export class FilterProviderPagingResponse {
  @ApiModelProperty({
    description: "Row",
    example: [
      {
        "id": "d7d73d7b-5cbe-4d4c-b6b9-11756f3ea31a",
        "userid": "a5dc4dce-ae30-441b-a806-c5cdf77de171",
        "slug": "do_tran_minh_chu_2",
        "name": "Đỗ Trần Minh Chu",
        "avatarurl": "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
        "voiceurl": "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
        "description": "This is description about me <3",
        "cost": 6,
        "skillid": "45cc1d82-644b-4f7a-b474-7492b2575f10",
        "skillname": "Liên Minh Huyền Thoại",
        "skillimageurl": "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg"
      },
      {
        "id": "e2c18733-4912-4bc0-bdf3-02c2243d22f4",
        "userid": "8ef2aa17-dd44-426f-9606-c87e20199bef",
        "slug": "do_tran_minh_chu",
        "name": "Đỗ Trần Minh Chu",
        "avatarurl": "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
        "voiceurl": "https://files.playerduo.net/production/audio_voices/79eb9c87-917c-4331-88f8-7a04d2c2712b__83a27d00-e0a2-11eb-8c44-9f18adc4e12c__audio_voice.mp3",
        "description": "This is description about me <3",
        "cost": 8,
        "skillid": "45cc1d82-644b-4f7a-b474-7492b2575f10",
        "skillname": "Liên Minh Huyền Thoại",
        "skillimageurl": "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg"
      }
    ],
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: FilterProviderResponse,
  })
  rows!: Array<FilterProviderResponse>;

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
