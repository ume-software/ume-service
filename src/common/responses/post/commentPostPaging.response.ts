import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { CommentPostResponse } from "./commentPost.response";
import { PaginationResponse } from "../base";

@ApiModel({
    description: "Comment Post paging response",
})
export class CommentPostPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: CommentPostResponse,
    })
    row!: Array<CommentPostResponse>;

    @ApiModelProperty({
        description: "Count",
        example: 100,
    })
    count!: number;

    @ApiModelProperty({
        description: "Pagination",
        model: PaginationResponse,
    })
    pagination!: PaginationResponse;
}
