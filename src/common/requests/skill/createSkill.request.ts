import { IsString, IsUrl } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create skill request",
})
export class CreateSkillRequest {
    @ApiModelProperty({
        description: "Skill name",
        required: true,
        example: "Liên Minh Huyền Thoại",
    })
    @IsString()
    name!: string;

    @ApiModelProperty({
        description: "Image url of skill",
        required: true,
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    @IsUrl()
    imageUrl!: string;
    constructor(data: CreateSkillRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateSkillRequest, data, [
                    "name",
                    "imageUrl",
                ])
            );
        }
    }
}
