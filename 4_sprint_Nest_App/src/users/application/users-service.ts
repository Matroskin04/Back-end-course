// import {
//   BodyUserType,
//   UserOutputType,
// } from '../../infrastructure/repositories/repositories-types/users-types-repositories';
// import bcrypt from 'bcryptjs';
// import { ObjectId } from 'mongodb';
// import { v4 as uuidv4 } from 'uuid';
// import jwt from 'jsonwebtoken';
// import { env } from '../../config';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/repository/users-repository';
import { BodyUserType } from '../infrastructure/repository/users-types-repositories';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/users-schema-model';
import { UserModelType } from '../domain/users-db-types';
import { UserViewType } from '../infrastructure/query.repository/users-types-query-repository';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    protected usersRepository: UsersRepository, // protected usersQueryRepository: UsersQueryRepository, // protected cryptoAdapter: CryptoAdapter,
  ) {}

  async createUser(inputBodyUser: BodyUserType): Promise<UserViewType> {
    // const passHash = await this.cryptoAdapter._generateHash(inputBodyUser.password);

    const user = this.UserModel.createInstance(inputBodyUser, this.UserModel);

    // const user = new UserDBType(
    //   new ObjectId(),
    //   inputBodyUser.login,
    //   inputBodyUser.email,
    //   new Date().toISOString(),
    //   'passHash',
    //   {
    //     confirmationCode: uuidv4(),
    //     expirationDate: new Date(),
    //     isConfirmed: true,
    //   },
    //   {
    //     confirmationCode: uuidv4(),
    //     expirationDate: new Date(),
    //   },
    // );

    await this.usersRepository.save(user);
    return user.modifyIntoViewModel();
  }

  async deleteSingleUser(id: string): Promise<boolean> {
    return this.usersRepository.deleteSingleUser(id);
  }

  // async checkCredentials(
  //   loginOrEmail: string,
  //   password: string,
  // ): Promise<UserDBType | false> {
  //   const user = await this.usersQueryRepository.getUserByLoginOrEmail(
  //     loginOrEmail,
  //   );
  //   if (!user || !user.emailConfirmation.isConfirmed) {
  //     return false;
  //   }
  //
  //   return (await bcrypt.compare(password, user.passwordHash)) ? user : false;
  // }

  // async getUserIdByAccessToken(token: string): Promise<null | ObjectId> {
  //
  //     try {
  //         const decode = jwt.verify(token, env.PRIVATE_KEY_ACCESS_TOKEN) as { userId: string };
  //         return new ObjectId(decode.userId)
  //
  //     } catch (err) {
  //         return null
  //     }
  // }
}
