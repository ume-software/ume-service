import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { DetailAlbumResponse } from "./detailAlbum.response";
import { PaginationResponse } from "../base/pagination.response";

@ApiModel({
    description: "Album paging response",
})
export class AlbumPagingResponse {
    @ApiModelProperty({
        description: "Row",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: DetailAlbumResponse,
    })
    row!: Array<DetailAlbumResponse>;

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
