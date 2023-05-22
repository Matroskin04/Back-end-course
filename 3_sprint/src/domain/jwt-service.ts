import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {PRIVATE_KEY_ACCESS_TOKEN, PRIVATE_KEY_REFRESH_TOKEN} from "../tokens";
import {randomUUID} from "crypto";
import {jwtQueryRepository} from "../queryRepository/jwt-query-repository";
import {devicesService} from "./devices-service";
import {AccessRefreshTokens} from "./service-types/jwt-types-service";

export const jwtService = {

    createAccessToken(userId: string): string  {

        return jwt.sign({userId: userId}, PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: '10s'})
    },

    createRefreshToken(userId: string, existingDeviceId: string | null): string  {

        const deviceId = existingDeviceId ?? randomUUID();
        return jwt.sign({userId, deviceId}, PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: '20s'})
    },

    async changeTokensByRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<AccessRefreshTokens | false> {

        try {
            const payload = jwtQueryRepository.getPayloadToken(cookieRefreshToken);

            const accessToken = this.createAccessToken(userId.toString());
            const refreshToken = this.createRefreshToken(userId.toString(), payload!.deviceId); // todo обработать если null

            const payloadNewRefresh = jwtQueryRepository.getPayloadToken(refreshToken);
            const isModified = await devicesService.updateLastActiveDate(payload!.deviceId, payloadNewRefresh!.iat!);

            if (!isModified) return false;

            return {
                accessToken,
                refreshToken
            }

        } catch (err) {
            console.log(err);
            throw new Error(`Error: ${err}`)
        }
    },

    // Реализация рефреш с сохранением использованных токенов
     // async deactivateRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<void> {
    //
    //     try {
    //         const refreshObject = {
    //             userId,
    //             refreshToken: cookieRefreshToken
    //         }
    //         await jwtRepository.deactivateRefreshToken(refreshObject);
    //         return;
    //
    //     } catch (err) {
    //         console.log(err);
    //         throw new Error(`Error: ${err}`)
    //     }
    // }

}