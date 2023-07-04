import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {jwtQueryRepository} from "../queryRepository/jwt-query-repository";
import {devicesService} from "./devices-service";
import {AccessRefreshTokens} from "./service-types/jwt-types-service";
import {env} from "../config";

export const jwtService = {

    createAccessToken(userId: string): string  {

        return jwt.sign({userId: userId}, env.PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: '20s'})
    },

    createRefreshToken(userId: string, existingDeviceId: string | null): string  {

        const deviceId = existingDeviceId ?? randomUUID();
        return jwt.sign({userId, deviceId}, env.PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: '30s'})
    },

    async changeTokensByRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<AccessRefreshTokens | false> {

        try {
            const payload = jwtQueryRepository.getPayloadToken(cookieRefreshToken);

            if (!payload) return false
            const accessToken = this.createAccessToken(userId.toString());
            const refreshToken = this.createRefreshToken(userId.toString(), payload.deviceId);

            const payloadNewRefresh = jwtQueryRepository.getPayloadToken(refreshToken);
            if (!payloadNewRefresh?.iat) return false
            const isModified = await devicesService.updateLastActiveDate(payload.deviceId, payloadNewRefresh.iat);

            if (!isModified) return false;

            return {
                accessToken,
                refreshToken
            }

        } catch (err) {
            console.log(err);
            throw new Error(`Error: ${err}`)
        }
    }
}