import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostResponse } from "./bookingCost.response";
import { SkillResponse } from "./skill.response";

@ApiModel({
  description: "Provider skill response",
})
export class ProviderSkillResponse {
  @ApiModelProperty({
    description: "Id's provider",
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
    description: "Provider skill name",
    example: "0c261207-3e82-4d56-a261-32175b797a78",
  })
  providerId!: string;

  @ApiModelProperty({
    description: "Skill id",
    example: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
  })
  skillId!: string;

  @ApiModelProperty({
    description: "Default cost",
    example: 10,
  })
  defaultCost!: number;

  @ApiModelProperty({
    description: "Position",
    example: 1,
  })
  position!: number;

  @ApiModelProperty({
    description: "Position",
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: BookingCostResponse,
    example: [
      {
        id: "cee99f3c-d488-4991-a96f-5a5805987a78",
        createdAt: "2023-05-12T07:31:19.794Z",
        updatedAt: "2023-05-12T07:31:19.794Z",
        deletedAt: null,
        providerSkillId: "42ac81c2-1815-45f7-b598-412487161e1f",
        startTimeOfDay: "09:00",
        endTimeOfDay: "15:00",
        amount: 10,
      },
    ],
  })
  bookingCosts!: Array<BookingCostResponse>;

  @ApiModelProperty({
    description: "Position",
    model: SkillResponse,
    example: {
      id: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
      createdAt: "2023-05-12T07:18:27.100Z",
      updatedAt: "2023-05-12T07:18:27.100Z",
      deletedAt: null,
      name: "Liên Minh Huyền Thoại",
      imageUrl:
        "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    },
  })
  skill!: SkillResponse;
}
