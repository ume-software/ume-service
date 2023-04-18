import { IHostLanguage } from "@/enums/hostLanguage.enum"

export const fieldsParam = {
    in: "query",
    name: "fields",
    required: false,
    schema: {
        type: "string",
        default: '["$all"]'
    }

}
export const whereParam = {
    in: "query",
    name: "where",
    required: false,
    schema: {
        type: "string",
        default: '{}'
    }
}
export const limitParam = {
    in: "query",
    name: "limit",
    required: false,
    schema: {
        type: "string",
        default: 'unlimited'
    }
}
export const pageParam = {
    in: "query",
    name: "page",
    required: false,
    schema: {
        type: "number",
        default: 1
    }
}
export const orderParam = {
    in: "query",
    name: "order",
    required: false,
    schema: {
        type: "string",
        default: '[["created_at","DESC"]]',
    }
}
export const hlParam = {
    in: "query",
    name: "hl",
    required: false,
    schema: {
        type: "string",
        enum: Object.values(IHostLanguage),
        default: IHostLanguage.en,
    }
}