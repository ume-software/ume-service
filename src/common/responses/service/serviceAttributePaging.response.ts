import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { PaginationResponse } from "../base";
import { ServiceAttributeResponse } from "./serviceAttribute.response";

@ApiModel({
    description: "Service Attribute Paging response",
})
export class ServiceAttributePagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ServiceAttributeResponse,
    })
    row!: Array<ServiceAttributeResponse>;

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
