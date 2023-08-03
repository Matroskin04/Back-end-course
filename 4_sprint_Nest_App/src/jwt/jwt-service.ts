import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { JwtQueryRepository } from './jwt-query-repository';
import { AccessRefreshTokens } from './jwt-types-service';
dotenv.config();

@Injectable()
export class JwtService {
  constructor(
    protected jwtQueryRepository: JwtQueryRepository, // protected devicesService: DevicesService,
  ) {}

  // createAccessToken(userId: string): string {
  //   return this.jwtService.sign(
  //     { userId: userId },
  //     process.env.PRIVATE_KEY_ACCESS_TOKEN!,
  //     {
  //       expiresIn: process.env.EXPIRATION_TIME_REFRESH_TOKEN,
  //     },
  //   ); //todo key access in env? Воскл знак ok?
  //   //todo to do validation of existing all process env? или нет смысла
  // }
  //
  // createRefreshToken(userId: string, existingDeviceId: string | null): string {
  //   const deviceId = existingDeviceId ?? randomUUID();
  //   return this.jwtService.sign(
  //     { userId, deviceId },
  //     process.env.PRIVATE_KEY_REFRESH_TOKEN!,
  //     { expiresIn: process.env.EXPIRATION_TIME_ACCESS_TOKEN },
  //   );
  // }

  // async changeTokensByRefreshToken(
  //   userId: ObjectId,
  //   cookieRefreshToken: string,
  // ): Promise<AccessRefreshTokens> {
  //   const payloadToken =
  //     this.jwtQueryRepository.getPayloadToken(cookieRefreshToken);
  //   if (!payloadToken) {
  //     throw new Error('Refresh token is invalid.');
  //   }
  //
  //   const accessToken = this.createAccessToken(userId.toString());
  //   const refreshToken = this.createRefreshToken(
  //     userId.toString(),
  //     payloadToken.deviceId,
  //   );
  //
  //   const payloadNewRefresh =
  //     this.jwtQueryRepository.getPayloadToken(refreshToken);
  //   if (!payloadNewRefresh?.iat) {
  //     throw new Error('Refresh token is invalid.');
  //   }
  //
  //   const isModified = await this.devicesService.updateLastActiveDate(
  //     payloadToken.deviceId,
  //     payloadNewRefresh.iat,
  //   );
  //   if (!isModified) {
  //     throw new Error('Last active date is not updated.');
  //   }
  //
  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }
}
