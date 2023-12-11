import { EUrlType } from "@/enums/urlType";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Attachment response",
})
export class AttachmentResponse {
    @ApiModelProperty({
        description: "Url",
        example: "https://picsum.photos/seed/Zmmvb/640/480",
        type: SwaggerDefinitionConstant.STRING,
    })
    url!: string;

    @ApiModelProperty({
        description: "Url type",
        enum: Object.values(EUrlType),
        example: EUrlType.IMAGE,
    })
    type!: EUrlType;
}
