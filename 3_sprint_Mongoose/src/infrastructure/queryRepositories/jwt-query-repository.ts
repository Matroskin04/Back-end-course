import { injectable } from "inversify";
import jwt, {JwtPayload} from "jsonwebtoken";

@injectable()
export class JwtQueryRepository {

    getPayloadToken(refreshToken: string): JwtPayload | null {

        try {
            return jwt.verify(refreshToken, process.env.PRIVATE_KEY_REFRESH_TOKEN!) as JwtPayload;

        } catch (e) {
            return null;
        }
    }
}