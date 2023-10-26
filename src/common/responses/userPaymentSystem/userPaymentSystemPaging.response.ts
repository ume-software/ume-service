import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "../base";
import { UserPaymentSystemResponse } from "./userPaymentSystem.response";

@ApiModel({
    description: "User payment system paging response",
})
export class UserPaymentSystemPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: UserPaymentSystemResponse,
    })
    row!: Array<UserPaymentSystemResponse>;

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
