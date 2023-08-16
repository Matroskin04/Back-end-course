import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UsersSAQueryRepository } from '../../users/super-admin/infrastructure/query.repository/users-sa.query.repository';
import { UserModelType } from '../../users/super-admin/domain/users.db.types';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/super-admin/domain/users.entity';
import {
  ARTokensAndUserIdType,
  UserDBServiceType,
} from './dto/auth.dto.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected jwtService: JwtService,
    protected usersQueryRepository: UsersSAQueryRepository,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDBServiceType | false> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(
      loginOrEmail,
    );
    if (!user || !user.emailConfirmation.isConfirmed) {
      return false;
    }

    return (await bcrypt.compare(password, user.passwordHash)) ? user : false;
  }

  async loginUser(userId: ObjectId): Promise<ARTokensAndUserIdType | null> {
    const user = await this.usersQueryRepository.getUserByUserId(userId);
    if (!user) {
      //Если user не существует, значит payload неверный
      return null;
    }
    const accessToken = this.jwtService.sign(
      { userId: userId.toString() },
      {
        secret: process.env.PRIVATE_KEY_ACCESS_TOKEN!,
        expiresIn: process.env.EXPIRATION_TIME_ACCESS_TOKEN!,
      },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId.toString(), deviceId: uuidv4() },
      {
        secret: process.env.PRIVATE_KEY_REFRESH_TOKEN!,
        expiresIn: process.env.EXPIRATION_TIME_REFRESH_TOKEN!,
      },
    );

    return {
      accessToken,
      refreshToken,
      userId: user._id,
    };
  }
}
