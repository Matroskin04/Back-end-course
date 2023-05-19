import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {AccessRefreshTokens} from "./service-types/auth-types-service";
import {authRepository} from "../repositories/auth-repository";
import {PRIVATE_KEY_ACCESS_TOKEN, PRIVATE_KEY_REFRESH_TOKEN} from "../tokens";

export const jwtService = {

    createAccessToken(userId: ObjectId): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: '10m'})
    },

    createRefreshToken(userId: ObjectId): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: '20m'})
    },

    async changeTokensByRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<AccessRefreshTokens> {

        try {
            const refreshObject = {
                userId,
                refreshToken: cookieRefreshToken
            }
            await authRepository.deactivateRefreshToken(refreshObject);

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
            await authRepository.deactivateRefreshToken(refreshObject);
            return;

        } catch (err) {
            console.log(err);
            throw new Error(`Error: ${err}`)
        }
    }
}