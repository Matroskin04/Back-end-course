import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../users/application/users-service';
import { UsersQueryRepository } from '../../users/infrastructure/query.repository/users-query-repository';
import { UserDBType, UserModelType } from '../../users/domain/users-db-types';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/domain/users-schema-model';
import { CryptoAdapter } from '../../adapters/crypto-adapter';
import { UsersRepository } from '../../users/infrastructure/repository/users-repository';
import { EmailManager } from '../../managers/email-manager';
import { ARTokensAndUserId } from './auth.dto.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ErrorsTypeService } from '../../application/services/service-types/responses-types-service';
import { UserInfoType } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected cryptoAdapter: CryptoAdapter,
    protected emailManager: EmailManager,
    protected jwtService: JwtService,
    protected usersService: UsersService,
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDBType | false> {
    const user = await this.usersQueryRepository.getUserByLoginOrEmail(
      loginOrEmail,
    );
    if (!user || !user.emailConfirmation.isConfirmed) {
      return false;
    }

    return (await bcrypt.compare(password, user.passwordHash)) ? user : false;
  }

  async loginUser(userId: ObjectId): Promise<ARTokensAndUserId | null> {
    const user = await this.usersQueryRepository.getUserByUserId(userId);
    if (!user) {
      //Если user не существует, значит payload неверный
      return null;
    }
    const accessToken = this.jwtService.sign(
      { userId: userId.toString() },
      {
        privateKey: process.env.PRIVATE_KEY_ACCESS_TOKEN!,
        expiresIn: process.env.EXPIRATION_TIME_ACCESS_TOKEN!,
      },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId.toString() },
      {
        privateKey: process.env.PRIVATE_KEY_REFRESH_TOKEN!,
        expiresIn: process.env.EXPIRATION_TIME_REFRESH_TOKEN!,
      },
    );

    return {
      accessToken,
      refreshToken,
      userId: user._id,
    };
  }

  async registerUser(
    email: string,
    login: string,
    password: string,
  ): Promise<void> {
    const passwordHash = await this.cryptoAdapter._generateHash(password);
    const userInfo = {
      email,
      login,
      passwordHash,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 5, seconds: 20 }),
        isConfirmed: false,
      },
      passwordRecovery: {},
    };
    const user = this.UserModel.createInstance(userInfo, this.UserModel);

    await this.usersRepository.save(user);
    await this.emailManager.sendEmailConfirmationMessage(
      user.email,
      user.emailConfirmation.confirmationCode,
    );

    return;
  }

  async confirmEmail(inputConfirmationCode: string): Promise<void> {
    const user = await this.usersQueryRepository.getUserByCodeConfirmation(
      inputConfirmationCode,
    );
    if (!user) {
      throw new BadRequestException([
        { message: 'Code is incorrect', field: 'code' },
      ]);
    }

    const result = await this.usersRepository.updateConfirmation(user._id);
    if (!result) {
      throw new Error('Email confirmation failed.');
    }

    return;
  }

  async resendConfirmationEmailMessage(
    userId: ObjectId,
    email: string,
  ): Promise<void> {
    const newCode = uuidv4();
    const newDate = add(new Date(), { hours: 5, seconds: 20 });

    const result = await this.usersRepository.updateCodeConfirmation(
      userId,
      newCode,
      newDate,
    );
    if (!result) {
      throw new Error('Resending confirmation email message failed.');
    }

    await this.emailManager.sendEmailConfirmationMessage(email, newCode);
    return;
  }

  async getUserInformation(userId: ObjectId): Promise<UserInfoType | null> {
    const user = await this.usersQueryRepository.getUserByUserId(userId);

    if (!user) {
      return null;
    }

    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    };
  }

  async sendEmailPasswordRecovery(email: string): Promise<void> {
    const user: UserDBType | null =
      await this.usersQueryRepository.getUserByLoginOrEmail(email);
    if (!user) return;

    const newCode = uuidv4();
    const newDate = add(new Date(), { hours: 1 });

    await this.usersRepository.updateCodePasswordRecovery(
      user._id,
      newCode,
      newDate,
    );
    await this.emailManager.sendEmailPasswordRecovery(email, newCode);

    return;
  }

  async saveNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<true | ErrorsTypeService> {
    const user = await this.usersQueryRepository.getUserByRecoveryCode(
      recoveryCode,
    );
    if (!user) {
      throw new BadRequestException([
        {
          message: 'RecoveryCode is incorrect or expired',
          field: 'recoveryCode',
        },
      ]);
    }

    if (user.passwordRecovery.expirationDate < new Date()) {
      throw new BadRequestException([
        {
          message: 'RecoveryCode is incorrect or expired',
          field: 'recoveryCode',
        },
      ]);
    }

    const passwordHash = await this.cryptoAdapter._generateHash(newPassword);
    await this.usersRepository.updatePassword(passwordHash, user._id);

    return true;
  }
}
