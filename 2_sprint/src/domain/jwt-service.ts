import jwt from 'jsonwebtoken'
import {PRIVATE_KEY_ACCESS_TOKEN, PRIVATE_KEY_REFRESH_TOKEN} from "../setting";
import {UserDBType} from "../types/types";

export const jwtService = {

    createAccessToken(user: UserDBType): string  {

        return jwt.sign({userId: user._id}, PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: 10})
    },

    createRefreshToken(user: UserDBType): string  {

        return jwt.sign({userId: user._id}, PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: 20})
    }
}