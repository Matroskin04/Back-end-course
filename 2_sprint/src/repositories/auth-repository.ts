import {refreshTokensCollection} from "../db";
import {refreshTokensDBType} from "../types/types";

export const authRepository = {

    async deactivateRefreshToken(refreshObject: refreshTokensDBType): Promise<void> {

        await refreshTokensCollection.insertOne(refreshObject);
        return;
    },

    async isRefreshTokenActive(refreshToken: string): Promise<boolean> {

        const token = await refreshTokensCollection.findOne({refreshToken: refreshToken});
        return !token
    }
}