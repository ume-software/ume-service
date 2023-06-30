import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
  } from "express-swagger-typescript";
  import { PaginationResponse } from "./pagination.response";
import { NoticeResponse } from "./notice.reponse";

  
  @ApiModel({
    description: "Notice paging response",
  })
  export class NoticePagingResponse {
    @ApiModelProperty({
      description: "Row",
      type: SwaggerDefinitionConstant.ARRAY,
      itemType: NoticeResponse,
    })
    row!: Array<NoticeResponse>;
  
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
  