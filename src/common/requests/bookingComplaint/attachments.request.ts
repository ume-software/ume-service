import { EUrlType } from "@/enums/urlType";
import { IsEnum, IsUrl } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Attachment request",
})
export class AttachmentRequest {
    @ApiModelProperty({
        description: "url",
        required: true,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    @IsUrl()
    url!: string;

    @ApiModelProperty({
        description: "Type",
        required: true,
        enum: Object.values(EUrlType),
        example: EUrlType.IMAGE,
    })
    @IsEnum(EUrlType)
    type!: EUrlType;

    constructor(data: AttachmentRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(AttachmentRequest, data, ["url", "type"])
            );
        }
    }
}
