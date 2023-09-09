import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsOptional, IsString, IsUrl } from "class-validator";

@ApiModel({
    description: "Update skill request",
})
export class UpdateSkillRequest {
    @ApiModelProperty({
        description: "Skill name",
        required: false,
        example: "Liên Minh Huyền Thoại",
    })
    @IsOptional()
    @IsString()
    name!: string;

    @ApiModelProperty({
        description: "Image url of skill",
        required: false,
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    @IsOptional()
    @IsUrl()
    imageUrl!: string;

    constructor(data: UpdateSkillRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateSkillRequest, data, [
                    "name",
                    "imageUrl",
                ])
            );
        }
    }
}
