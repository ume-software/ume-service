import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "../base/pagination.response";
import { DistrictResponse } from "./district.response";

@ApiModel({
    description: "District paging response",
})
export class DistrictPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: DistrictResponse,
    })
    row!: Array<DistrictResponse>;

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
