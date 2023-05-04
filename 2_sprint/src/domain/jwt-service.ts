import jwt from 'jsonwebtoken'
import {UserDBType} from "../repositories/repositories-types/users-types-repositories";
import {PRIVATE_KEY} from "../setting";
import {ObjectId} from "mongodb";

export const jwtService = {

    createJWT(user: UserDBType): string  {

        return jwt.sign({userId: user._id}, PRIVATE_KEY, {expiresIn: '1h'})
    },

    async getUserIdByToken(token: string): Promise<null | ObjectId> {

        try {
            const decode = jwt.verify(token, PRIVATE_KEY) as {userId: number};
            return new ObjectId(decode.userId)

        } catch (err) {
            return null
        }
    }
}