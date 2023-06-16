import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { ThumbnailRequest } from "./thumbnail.request";

@ApiModel({
    description: "Create post request",
})
export class CreatePostRequest {
    @ApiModelProperty({
        description: "Content",
        required: true,
        example: "Content Here",
    })
    content!: string;

    @ApiModelProperty({
        description: "Booking status",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ThumbnailRequest,
    })
    thumbnails!: Array<ThumbnailRequest>;
}
