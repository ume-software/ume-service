import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "../base/pagination.response";
import { ProvinceResponse } from "./province.response";

@ApiModel({
    description: "Province paging response",
})
export class ProvincePagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProvinceResponse,
    })
    row!: Array<ProvinceResponse>;

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
