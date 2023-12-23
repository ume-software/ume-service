import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { IsArray, IsString } from "class-validator";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create new post request",
})
export class CreateNewInstantCardRequest {
    userId!: string;

    @ApiModelProperty({
        description: "Content",
        required: true,
        example:
            "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsString()
    content!: string;

    @ApiModelProperty({
        description: "Gradient colors",
        required: true,
        example: ["#833ab4", "#fd1d1d", "#fcb045"],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    @IsArray()
    @IsString({ each: true })
    gradientColors!: Array<string>;

    @ApiModelProperty({
        description: "Hash tags",
        required: true,
        example: ["gammer"],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    @IsArray()
    @IsString({ each: true })
    hashTags!: Array<string>;

    constructor(data: CreateNewInstantCardRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateNewInstantCardRequest, data, [
                    "userId",
                    "content",
                    "gradientColors",
                    "hashTags",
                ])
            );
        }
    }
}
