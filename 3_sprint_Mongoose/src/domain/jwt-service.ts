import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {jwtQueryRepository} from "../queryRepository/jwt-query-repository";
import {devicesService} from "./devices-service";
import {AccessRefreshTokens} from "./service-types/jwt-types-service";
import {env} from "../config";

export const jwtService = {

    createAccessToken(userId: string): string {

        return jwt.sign({userId: userId}, env.PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: '20s'})
    },

    createRefreshToken(userId: string, existingDeviceId: string | null): string {

        const deviceId = existingDeviceId ?? randomUUID();
        return jwt.sign({userId, deviceId}, env.PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: '30s'})
    },

    async changeTokensByRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<AccessRefreshTokens> {

        const payloadToken = jwtQueryRepository.getPayloadToken(cookieRefreshToken);
        if (!payloadToken) {
            throw new Error('Refresh token is invalid.');
        }

        const accessToken = this.createAccessToken(userId.toString());
        const refreshToken = this.createRefreshToken(userId.toString(), payloadToken.deviceId);

        const payloadNewRefresh = jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadNewRefresh?.iat) {
            throw new Error('Refresh token is invalid.');
        }

        const isModified = await devicesService.updateLastActiveDate(payloadToken.deviceId, payloadNewRefresh.iat);
        if (!isModified) {
            throw new Error('Last active date is not updated.');
        }

        return {
            accessToken,
            refreshToken
        }
    }
}