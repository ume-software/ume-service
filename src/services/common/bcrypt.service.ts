import * as bcrypt from "bcrypt";

export class BcryptService {
    constructor() {}

    hashData(data: string, saltRounds: number = 10) {
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(data, salt);
    }

    async compareDataWithHash(data: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(data, hash);
    }
}
