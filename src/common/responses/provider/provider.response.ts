import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ProviderServiceResponse } from "../providerService";
import { ProviderConfigResponse } from "../providerConfig";

@ApiModel({
    description: "Provider response",
})
export class ProviderResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
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
        description: "Id's user",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    userId!: string;

    @ApiModelProperty({
        description: "Slug url",
        required: true,
        example: "do_tran_minh_chu",
    })
    slug!: string;

    @ApiModelProperty({
        description: "Display name of provider",
        required: true,
        example: "Đỗ Trần Minh Chu",
    })
    name!: string;

    @ApiModelProperty({
        description: "Avatart Url of provider",
        required: true,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    avatarUrl!: string;

    @ApiModelProperty({
        description: "providerServices",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProviderServiceResponse,
    })
    providerServices!: Array<ProviderServiceResponse>;


    @ApiModelProperty({
        description: "providerConfig",
        model: ProviderConfigResponse,
    })
    providerConfig!: ProviderConfigResponse;
}
