import { ObjectId } from 'mongodb';
import {
  UserDBType,
  UserModelType,
} from '../../../super-admin/domain/users.db.types';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../super-admin/domain/users.entity';
import { UsersInfoPublicType } from './users-public.types.query.repository';

export class UsersPublicQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}
  async getUserInfoById(userId: ObjectId): Promise<null | UsersInfoPublicType> {
    const user = await this.UserModel.findOne({ _id: userId });
    if (!user) return null;

    return {
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    };
  }
}
