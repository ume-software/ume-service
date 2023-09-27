import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { PaginationResponse } from "../base";
import { VoucherResponse } from "./voucher.response";

@ApiModel({
    description: "Voucher Paging response",
})
export class VoucherPagingResponse {
    @ApiModelProperty({
        description: "Row",

        type: SwaggerDefinitionConstant.ARRAY,
        itemType: VoucherResponse,
    })
    row!: Array<VoucherResponse>;

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
