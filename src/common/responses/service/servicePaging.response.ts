import {
  ApiModel,
  ApiModelProperty,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

import { ServiceResponse } from "./service.response";
import { PaginationResponse } from "../base";


@ApiModel({
  description: "Service Paging response",
})
export class ServicePagingResponse {
  @ApiModelProperty({
    description: "Row",
    example: [
      {
        "id": "4383a434-c79f-4482-9203-f2a27f46791f",
        "createdAt": "2023-05-28T06:30:52.967Z",
        "updatedAt": "2023-05-28T06:30:52.967Z",
        "deletedAt": null,
        "name": "earum",
        "imageUrl": "https://loremflickr.com/640/480?lock=458349380370432"
      },
      {
        "id": "54e72f72-93cb-4a61-a752-3715b3c18872",
        "createdAt": "2023-05-28T06:30:52.984Z",
        "updatedAt": "2023-05-28T06:30:52.984Z",
        "deletedAt": null,
        "name": "inventore",
        "imageUrl": "https://loremflickr.com/640/480?lock=7190194765692928"
      },
      {
        "id": "497e693d-7f5c-4213-a9ba-27efd9057f6f",
        "createdAt": "2023-05-28T06:30:52.996Z",
        "updatedAt": "2023-05-28T06:30:52.996Z",
        "deletedAt": null,
        "name": "quasi",
        "imageUrl": "https://picsum.photos/seed/zHGysvzi/640/480"
      }
    ],
    type: SwaggerDefinitionConstant.ARRAY,
    itemType: ServiceResponse,
  })
  row!: Array<ServiceResponse>;

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
