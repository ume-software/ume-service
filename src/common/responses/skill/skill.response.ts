import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
  description: "Skill response",
})
export class SkillResponse {
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
    description: "Skill name",
    example: "Liên Minh Huyền Thoại",
  })
  name!: string;

  @ApiModelProperty({
    description: "Image url of skill",
    example:
      "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
  })
  imageUrl!: string;
}
