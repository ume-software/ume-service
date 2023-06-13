import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
  } from "express-swagger-typescript";
  import { PaginationResponse } from "./pagination.response";
import { PostResponse } from "./post.response";

  
  @ApiModel({
    description: "Post paging response",
  })
  export class PostPagingResponse {
    @ApiModelProperty({
      description: "Row",
      type: SwaggerDefinitionConstant.ARRAY,
      itemType: PostResponse,
    })
    row!: Array<PostResponse>;
  
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
  