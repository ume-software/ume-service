import { EUrlType } from "@/enums/urlType";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";


@ApiModel({
    description: "Thumbnail response",
})
export class ThumbnailResponse {
    @ApiModelProperty({
        description: "Url",
        example: "https://picsum.photos/seed/Zmmvb/640/480",
        type:SwaggerDefinitionConstant.STRING
    })
    url!: string;

    @ApiModelProperty({
        description: "Url type",
        enum: Object.values(EUrlType),
        example: EUrlType.IMAGE
    })
    type!: EUrlType;


}
