import jwt, { JwtPayload } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtQueryRepository {
  getPayloadToken(refreshToken: string): JwtPayload | null {
    try {
      return jwt.verify(
        refreshToken,
        process.env.PRIVATE_KEY_REFRESH_TOKEN!,
      ) as JwtPayload;
    } catch (e) {
      return null;
    }
  }
}
