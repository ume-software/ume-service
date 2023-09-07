export interface IErrorResponse {
    message: string;
    type: string;
    codeNumber: number;
    statusCode: number;
    [x: string]: any;
}
