import bcrypt from "bcryptjs";
import {injectable} from "inversify";

@injectable()
export class CryptoAdapter {
    constructor() {
    }

    async _generateHash(password: string): Promise<string> {

        return await bcrypt.hash(password, 10);
    }
}