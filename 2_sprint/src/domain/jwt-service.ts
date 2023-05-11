import jwt from 'jsonwebtoken'
import {PRIVATE_KEY_ACCESS_TOKEN, PRIVATE_KEY_REFRESH_TOKEN} from "../setting";
import {ObjectId} from "mongodb";

export const jwtService = {

    createAccessToken(userId: ObjectId): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: 10})
    },

    createRefreshToken(userId: ObjectId): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: 20})
    }
}