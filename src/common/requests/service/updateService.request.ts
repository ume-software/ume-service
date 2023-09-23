import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsOptional, IsString, IsUrl } from "class-validator";

@ApiModel({
    description: "Update service request",
})
export class UpdateServiceRequest {
    @ApiModelProperty({
        description: "Service name",
        required: false,
        example: "Liên Minh Huyền Thoại",
    })
    @IsOptional()
    @IsString()
    name!: string;

    @ApiModelProperty({
        description: "Image url of service",
        required: false,
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    @IsOptional()
    @IsUrl()
    imageUrl!: string;

    constructor(data: UpdateServiceRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateServiceRequest, data, [
                    "name",
                    "imageUrl",
                ])
            );
        }
    }
}
