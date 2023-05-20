import jwt, {JwtPayload} from "jsonwebtoken";
import {PRIVATE_KEY_REFRESH_TOKEN} from "../tokens";

export const jwtQueryRepository = {

    getPayloadToken(refreshToken: string): JwtPayload | null {

        try {
            return jwt.verify(refreshToken, PRIVATE_KEY_REFRESH_TOKEN) as JwtPayload;

        } catch (e) {
            return null;
        }
    }
}