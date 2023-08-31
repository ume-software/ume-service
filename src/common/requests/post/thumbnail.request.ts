import { EUrlType } from "@/enums/urlType";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Thumbnail request",
})
export class ThumbnailRequest {
    @ApiModelProperty({
        description: "url",
        required: true,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    url!: string;

    @ApiModelProperty({
        description: "Type",
        required: true,
        enum: Object.values(EUrlType),
        example: EUrlType.IMAGE,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    type!: Array<EUrlType>;

    constructor(data: ThumbnailRequest) {
        this.url = data.url;
        this.type = data.type;
    }
}
