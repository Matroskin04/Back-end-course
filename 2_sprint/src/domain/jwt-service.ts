import jwt from 'jsonwebtoken'
import {PRIVATE_KEY_ACCESS_TOKEN, PRIVATE_KEY_REFRESH_TOKEN} from "../setting";
import {ObjectId} from "mongodb";
import {AccessRefreshTokens} from "./service-types/auth-types-service";
import {authRepositories} from "../repositories/auth-repositories";

export const jwtService = {

    createAccessToken(userId: ObjectId): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: '10m'})
    },

    createRefreshToken(userId: ObjectId): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: '20m'})
    },

    async changeTokensByRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<AccessRefreshTokens> {

        try { // todo такое оформление ошибки верное? (валидация в миддлвеере, а здесь перестраховка)
            const refreshObject = {
                userId,
                refreshToken: cookieRefreshToken
            }
            await authRepositories.deactivateRefreshToken(refreshObject);

            const accessToken = this.createAccessToken(userId);
            const refreshToken = this.createRefreshToken(userId);

            return {
                accessToken,
                refreshToken
            }

        } catch (err) {
            console.log(err);
            throw new Error(`Error: ${err}`)
        }
    },

    async deactivateRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<void> {

        try {
            const refreshObject = {
                userId,
                refreshToken: cookieRefreshToken
            }
            await authRepositories.deactivateRefreshToken(refreshObject);
            return;

        } catch (err) {
            console.log(err);
            throw new Error(`Error: ${err}`)
        }
    }
}