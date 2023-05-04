import jwt from 'jsonwebtoken'
import {UserDBType} from "../repositories/repositories-types/users-types-repositories";
import {PRIVATE_KEY} from "../setting";
import {ObjectId} from "mongodb";

export const jwtService = {

    createJWT(user: UserDBType): string  {

        return jwt.sign({userId: user._id}, PRIVATE_KEY, {expiresIn: 10*60})
    },

    async getUserIdByToken(token: string): Promise<null | ObjectId> {

        try {
            const decode: any = jwt.verify(token, PRIVATE_KEY);
            return new ObjectId(decode.userId)

        } catch (err) {
            return null
        }
    }
}