import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "../base/pagination.response";
import { CommuneResponse } from "./commune.response";

@ApiModel({
    description: "Commune paging response",
})
export class CommunePagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: CommuneResponse,
    })
    row!: Array<CommuneResponse>;

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
