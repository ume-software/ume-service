import { ApiModel, SwaggerDefinitionConstant, ApiModelProperty } from "express-swagger-typescript";


@ApiModel({
    description: 'Id description',
})
export class IdParam {
    @ApiModelProperty({
        description: 'Id',
        required: true,
        example: ['58e0effe-dcfc-4174-87ca-2b4dbd54a69c'],
        type: SwaggerDefinitionConstant.Model.Property.Type.STRING
    })
    public id!: string;

}