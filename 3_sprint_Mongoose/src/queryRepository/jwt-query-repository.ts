import { injectable } from "inversify";
import jwt, {JwtPayload} from "jsonwebtoken";
import {env} from "../config";

@injectable()
export class JwtQueryRepository {

    getPayloadToken(refreshToken: string): JwtPayload | null {

        try {
            return jwt.verify(refreshToken, env.PRIVATE_KEY_REFRESH_TOKEN) as JwtPayload;

        } catch (e) {
            return null;
        }
    }
}