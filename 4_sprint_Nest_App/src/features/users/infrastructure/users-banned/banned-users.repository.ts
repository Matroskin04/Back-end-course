import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BannedUser } from '../../domain/users-banned/users-banned.entity';
import {
  BannedUserDTOType,
  BannedUserModelType,
} from '../../domain/users-banned/users-banned.db.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BannedUsersRepository {
  constructor(
    @InjectModel(BannedUser.name)
    private BannedUserModel: BannedUserModelType,
  ) {}

  async deleteBannedUserById(userId: string): Promise<boolean> {
    const result = await this.BannedUserModel.deleteOne({ userId });
    return result.deletedCount === 1;
  }
}
