import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: 'Error Response`'
})
export class ErrorResponse {
    @ApiModelProperty({ 
        description: 'Error message',
        required: true,
        example: ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG.message.en,
    })
    public message?: string;

    @ApiModelProperty({
        description: 'Error message',
        required: true,
        example: 'router_exception_something_went_wrong',
    })
    public type?:string;

    @ApiModelProperty({
        description: 'Error code',
        required: true,
        example: ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG.code
    })
    public code?: number;
}
