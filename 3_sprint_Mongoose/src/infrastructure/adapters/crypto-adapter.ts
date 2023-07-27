import bcrypt from "bcryptjs";

export class CryptoAdapter {
    constructor() {
    }

    async _generateHash(password: string): Promise<string> {

        return await bcrypt.hash(password, 10);
    }
}