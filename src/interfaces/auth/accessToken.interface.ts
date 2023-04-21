
import { EAccountType } from "@/enums/accountType.enum"
import { LoginType } from "@prisma/client"

export interface IAccessToken {
    id: string
    loginType: LoginType,
    type: EAccountType,
    [key: string]: any
}