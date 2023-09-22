import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ProviderSkillResponse } from "./providerSkill.response";
import { PaginationResponse } from "../base";

@ApiModel({
    description: "Provider Skill response",
})
export class ProviderSkillPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProviderSkillResponse,
    })
    row!: Array<ProviderSkillResponse>;

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