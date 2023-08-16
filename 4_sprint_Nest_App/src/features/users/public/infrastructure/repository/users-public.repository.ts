import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../super-admin/domain/users.entity';
import { UserModelType } from '../../../super-admin/domain/users.db.types';
import { Injectable } from '@nestjs/common';

@Injectable() //todo для чего этот декоратор
export class UsersPublicRepository {
  constructor(
    @InjectModel(User.name)
    protected UserModel: UserModelType,
  ) {}
  async updatePassword(
    newPasswordHash: string,
    _id: ObjectId,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id },
      { $set: { passwordHash: newPasswordHash } },
    );
    return result.modifiedCount === 1;
  }
}
