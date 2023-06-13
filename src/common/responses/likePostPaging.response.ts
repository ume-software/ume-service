import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
  } from "express-swagger-typescript";
  import { PaginationResponse } from "./pagination.response";
import { LikePostResponse } from "./likePost.response";

  
  @ApiModel({
    description: "Like Post paging response",
  })
  export class LikePostPagingResponse {
    @ApiModelProperty({
      description: "Row",
      type: SwaggerDefinitionConstant.ARRAY,
      itemType: LikePostResponse,
    })
    row!: Array<LikePostResponse>;
  
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
  