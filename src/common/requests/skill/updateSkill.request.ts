import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Update skill request",
})
export class UpdateSkillRequest {
    @ApiModelProperty({
        description: "Skill name",
        required: true,
        example: "Liên Minh Huyền Thoại",
    })
    name!: string;

    @ApiModelProperty({
        description: "Image url of skill",
        required: true,
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    imageUrl!: string;

    constructor(data: UpdateSkillRequest) {
        this.name = data.name;
        this.imageUrl = data.imageUrl;
    }
}
