import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BannedUser } from '../../domain/users-banned/users-banned.entity';
import {
  BannedUserDTOType,
  BannedUserModelType,
} from '../../domain/users-banned/users-banned.db.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BannedUsersQueryRepository {
  constructor(
    @InjectModel(BannedUser.name)
    private BannedUserModel: BannedUserModelType,
  ) {}

  async getBannedUserById(userId: string): Promise<BannedUserDTOType | null> {
    const user = await this.BannedUserModel.findOne({ userId });
    return user;
  }
}
