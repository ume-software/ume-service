import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ServiceAttributeResponse } from "./serviceAttribute.response";

@ApiModel({
    description: "Service response",
})
export class ServiceResponse {
    @ApiModelProperty({
        description: "Id's service",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        example: null,
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Service name",
        example: "League of Legends",
    })
    name!: string;

    @ApiModelProperty({
        description: "Service name",
        example: "Liên Minh Huyền Thoại",
    })
    viName!: string;

    @ApiModelProperty({
        description: "Service name",
        example: "lien-minh-huyen-thoai",
    })
    slug!: string;

    @ApiModelProperty({
        description: "Image url of service",
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    imageUrl!: string;

    @ApiModelProperty({
        description: "Is activated",
        example: true,
    })
    isActivated!: boolean;

    @ApiModelProperty({
        description: "Service Attribute Value Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ServiceAttributeResponse,
    })
    serviceAttributes!: Array<ServiceAttributeResponse>;
}
