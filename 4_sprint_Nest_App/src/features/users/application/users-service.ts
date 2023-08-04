import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../infrastructure/repository/users-repository';
import { BodyUserType } from '../infrastructure/repository/users-types-repositories';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/users-schema-model';
import { UserModelType } from '../domain/users-db-types';
import { UserViewType } from '../infrastructure/query.repository/users-types-query-repository';
import { CryptoAdapter } from '../../../adapters/crypto-adapter';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected cryptoAdapter: CryptoAdapter,
    protected usersRepository: UsersRepository, // protected usersQueryRepository: UsersQueryRepository, // protected cryptoAdapter: CryptoAdapter,
  ) {}

  async createUser(inputBodyUser: BodyUserType): Promise<UserViewType> {
    const passwordHash = await this.cryptoAdapter._generateHash(
      inputBodyUser.password,
    );

    const userInfo = {
      email: inputBodyUser.email,
      login: inputBodyUser.login,
      passwordHash,
      emailConfirmation: {},
      passwordRecovery: {},
    };

    const user = this.UserModel.createInstance(userInfo, this.UserModel);

    await this.usersRepository.save(user);
    return user.modifyIntoViewModel();
  }

  async deleteSingleUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteSingleUser(id);
  }

  async getUserIdByAccessToken(token: string): Promise<null | ObjectId> {
    try {
      const decode = jwt.verify(
        token,
        process.env.PRIVATE_KEY_ACCESS_TOKEN!,
      ) as {
        userId: string;
      };
      return new ObjectId(decode.userId);
    } catch (err) {
      return null;
    }
  }
}
