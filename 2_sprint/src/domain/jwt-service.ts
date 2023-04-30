import jwt from 'jsonwebtoken'
import {UserTypeWith_Id} from "../repositories/repositories-types/users-types-repositories";
import {privateKey} from "../setting";
import {ObjectId} from "mongodb";

export const jwtService = {

    async createJWT(user: UserTypeWith_Id): Promise<string>  { // todo async имеет смысл

        return jwt.sign({userId: user._id}, privateKey, {expiresIn: 10*60})
    },

    async getUserIdByToken(token: string): Promise<null | ObjectId> {

        try {
            const decode: any = jwt.verify(token, privateKey); // todo как избавиться от any
            return new ObjectId(decode.userId)

        } catch (err) {
            return null
        }
    }
}