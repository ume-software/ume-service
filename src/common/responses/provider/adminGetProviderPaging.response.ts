import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { PaginationResponse } from "../base";
import { AdminGetProviderResponse } from "./adminGetProvider.response";

@ApiModel({
    description: "Admin get provider paging response",
})
export class AdminGetProviderPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AdminGetProviderResponse,
    })
    row!: Array<AdminGetProviderResponse>;

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
