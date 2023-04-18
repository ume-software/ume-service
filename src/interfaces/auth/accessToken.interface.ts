import { ERole } from "@/enums/role.enum"
import { LoginType } from "@prisma/client"

export interface IAccessToken {
    id: string
    roles: Array<ERole>,
    loginType: LoginType,
    type: "USER" | "ADMIN",
    [key: string]: any
}