import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
  } from "express-swagger-typescript";
  import { PaginationResponse } from "./pagination.response";
import { DetailAlbumResponse } from "./detailAlbum.reponse";


  
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
  