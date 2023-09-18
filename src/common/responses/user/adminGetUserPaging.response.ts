import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "../base";
import { AdminGetUserResponseResponse } from "./adminGetUser.response";

@ApiModel({
    description: "Top donate provider response",
})
export class AdminGetUserPagingResponseResponse {
    @ApiModelProperty({
        description: "Row",

        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AdminGetUserResponseResponse,
    })
    row!: Array<AdminGetUserResponseResponse>;

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
