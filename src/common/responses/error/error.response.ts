import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: 'Error Response`'
})
export class ErrorResponse {
    @ApiModelProperty({ 
        description: 'Error message',
        required: true,
        example: ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG.message,
    })
    public message?: string;

    @ApiModelProperty({
        description: 'Error message',
        required: true,
        example: 'router_exception_something_went_wrong',
    })
    public type?:string;

    @ApiModelProperty({
        description: 'statusCode',
        required: true,
        example: ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG.statusCode
    })
    public statusCode?: number;

    @ApiModelProperty({
        description: 'Error code',
        required: true,
        example: ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG.codeNumber
    })
    public codeNumber?: number;
}
