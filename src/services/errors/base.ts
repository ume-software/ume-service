export interface IBaseErrorOption {
    statusCode: number;
    codeNumber: number;
    type: string;
    message: string;
    description?: string;
    data?: any;
}
export class BaseError extends Error {
    constructor(options: IBaseErrorOption) {
        super();
        this.options = options;
    }

    options: IBaseErrorOption;

    toJSON() {
        return this.options;
    }
}
