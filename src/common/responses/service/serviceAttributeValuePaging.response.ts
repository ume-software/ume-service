import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { PaginationResponse } from "../base";
import { ServiceAttributeValueResponse } from "./serviceAttributeValue.response";

@ApiModel({
    description: "Service Attribute Value Paging response",
})
export class ServiceAttributeValuePagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ServiceAttributeValueResponse,
    })
    row!: Array<ServiceAttributeValueResponse>;

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
