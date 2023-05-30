import jwt, {JwtPayload} from "jsonwebtoken";
import {env} from "../config";

export const jwtQueryRepository = {

    getPayloadToken(refreshToken: string): JwtPayload | null {

        try {
            return jwt.verify(refreshToken, env.PRIVATE_KEY_REFRESH_TOKEN) as JwtPayload;

        } catch (e) {
            return null;
        }
    }
}