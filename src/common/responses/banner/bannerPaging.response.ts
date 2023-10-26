import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { PaginationResponse } from "../base";
import { BannerResponse } from "./banner.request";

@ApiModel({
    description: "Banner response",
})
export class BannerPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BannerResponse,
    })
    row!: Array<BannerResponse>;

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
