import { Injectable } from '@nestjs/common';
import { QueryUserModel } from '../../api/models/QueryUserModel';
import {
  EmailAndLoginTerm,
  UsersPaginationType,
} from './users-types-query-repository';
import { variablesForReturn } from '../../../infrastructure/queryRepositories/utils/variables-for-return';
import { InjectModel } from '@nestjs/mongoose';
import { UserModelType } from '../../domain/users-db-types';
import { User } from '../../domain/users-schema-model';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getAllUsers(query: QueryUserModel): Promise<UsersPaginationType> {
    const emailAndLoginTerm: EmailAndLoginTerm = [];
    let paramsOfSearch = {};
    const searchLoginTerm: string | null = query?.searchLoginTerm ?? null;
    const searchEmailTerm: string | null = query?.searchEmailTerm ?? null;
    const paramsOfElems = await variablesForReturn(query);

    if (searchEmailTerm)
      emailAndLoginTerm.push({
        email: { $regex: searchEmailTerm ?? '', $options: 'i' },
      });
    if (searchLoginTerm)
      emailAndLoginTerm.push({
        login: { $regex: searchLoginTerm ?? '', $options: 'i' },
      });
    if (emailAndLoginTerm.length) paramsOfSearch = { $or: emailAndLoginTerm };

    const countAllUsersSort = await this.UserModel.countDocuments(
      paramsOfSearch,
    );

    const allUsersOnPages = await this.UserModel.find(paramsOfSearch)
      .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
      .limit(+paramsOfElems.pageSize)
      .sort(paramsOfElems.paramSort);

    return {
      pagesCount: Math.ceil(countAllUsersSort / +paramsOfElems.pageSize),
      page: +paramsOfElems.pageNumber,
      pageSize: +paramsOfElems.pageSize,
      totalCount: countAllUsersSort,
      items: allUsersOnPages.map((p) => p.modifyIntoViewModel()),
    };
  }

  /*async getUserByLoginOrEmail(logOrEmail: string): Promise<UserDBType | null> {
    const user = await this.UserModel.findOne({
      $or: [{ login: logOrEmail }, { email: logOrEmail }],
    });

    if (user) {
      return user;
    }
    return null;
  }

  async getUserByUserId(userId: ObjectId): Promise<UserDBType | null> {
    // todo создавать ли отдельный метод для взятия логина

    const user = await UserModel.findOne({ _id: userId });

    if (user) {
      return user;
    }
    return user;
  }

  async getUserByCodeConfirmation(code: string): Promise<UserDBType | null> {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async getUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserDBType | null> {
    return UserModel.findOne({
      'passwordRecovery.confirmationCode': recoveryCode,
    });
  }*/
}
