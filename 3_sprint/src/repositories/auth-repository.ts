import {refreshTokensCollection} from "../db";
import {refreshTokenDBType} from "../types/types";

export const authRepository = {

    async deactivateRefreshToken(refreshObject: refreshTokenDBType): Promise<void> {

        await refreshTokensCollection.insertOne(refreshObject);
        return;
    },

    async isRefreshTokenActive(refreshToken: string): Promise<boolean> {

        const token = await refreshTokensCollection.findOne({refreshToken: refreshToken});
        return !token
    }
}