import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";

@ApiModel({
    description: "Comment post request",
})
export class CommentPostRequest {

    @ApiModelProperty({
        description: "Content",
        required: true,
        example: "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING
    })
    content!: string;

    @ApiModelProperty({
        description: "Parent Comment Id",
        required: false,
        type: SwaggerDefinitionConstant.STRING
    })
    parentCommentId?: string;

}
