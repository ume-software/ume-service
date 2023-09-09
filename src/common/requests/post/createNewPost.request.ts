import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ThumbnailRequest } from "./thumbnail.request";
import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create new post request",
})
export class CreateNewPostRequest {
    @ApiModelProperty({
        description: "Content",
        required: false,
        example:
            "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    content!: string;

    @ApiModelProperty({
        description: "Thumbnails",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ThumbnailRequest,
    })
    @IsArray()
    @IsObject({ each: true })
    thumbnails!: Array<ThumbnailRequest>;

    constructor(data: CreateNewPostRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateNewPostRequest, data, [
                    "content",
                    "thumbnails",
                ])
            );
        }
    }
}
