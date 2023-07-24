import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import {randomUUID} from "crypto";
import {AccessRefreshTokens} from "./service-types/jwt-types-service";
import {env} from "../../config";
import {DevicesService} from "./devices-service";
import {JwtQueryRepository} from "../../infrastructure/queryRepository/jwt-query-repository";
import { injectable } from 'inversify';


@injectable()
export class JwtService {

    constructor(protected jwtQueryRepository: JwtQueryRepository,
                protected devicesService: DevicesService) {}

    createAccessToken(userId: string): string {

        return jwt.sign({userId: userId}, env.PRIVATE_KEY_ACCESS_TOKEN, {expiresIn: '10m'})
    }

    createRefreshToken(userId: string, existingDeviceId: string | null): string {

        const deviceId = existingDeviceId ?? randomUUID();
        return jwt.sign({userId, deviceId}, env.PRIVATE_KEY_REFRESH_TOKEN, {expiresIn: '15m'})
    }

    async changeTokensByRefreshToken(userId: ObjectId, cookieRefreshToken: string): Promise<AccessRefreshTokens> {

        const payloadToken = this.jwtQueryRepository.getPayloadToken(cookieRefreshToken);
        if (!payloadToken) {
            throw new Error('Refresh token is invalid.');
        }

        const accessToken = this.createAccessToken(userId.toString());
        const refreshToken = this.createRefreshToken(userId.toString(), payloadToken.deviceId);

        const payloadNewRefresh = this.jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadNewRefresh?.iat) {
            throw new Error('Refresh token is invalid.');
        }

        const isModified = await this.devicesService.updateLastActiveDate(payloadToken.deviceId, payloadNewRefresh.iat);
        if (!isModified) {
            throw new Error('Last active date is not updated.');
        }

        return {
            accessToken,
            refreshToken
        }
    }
}

