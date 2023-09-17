
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { FeedbackResponse } from "./feedback.response";
import { PaginationResponse } from "../base";

@ApiModel({
    description: "Feedback paging response",
})
export class FeedbackPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: FeedbackResponse,
    })
    row!: Array<FeedbackResponse>;

    @ApiModelProperty({
        description: "Count",
        example: 100,
    })
    count!: number;

    @ApiModelProperty({
        description: "Pagination",
        example: {
            currentPage: 2,
            nextPage: 3,
            prevPage: 1,
            limit: 2,
        },
        model: PaginationResponse,
    })
    pagination!: PaginationResponse;
}
