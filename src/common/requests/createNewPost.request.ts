import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { ThumbnailResponse } from "../responses/thumbnail.reponse";

@ApiModel({
    description: "Create new post request",
})
export class CreateNewPostRequest {

    @ApiModelProperty({
        description: "Content",
        required: true,
        example: "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING
    })
    content!: string;

    @ApiModelProperty({
        description: "Thumbnails",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ThumbnailResponse,


    })
    thumbnails!: Array<ThumbnailResponse>;

}
