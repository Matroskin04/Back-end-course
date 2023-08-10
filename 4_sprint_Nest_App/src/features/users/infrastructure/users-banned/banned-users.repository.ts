import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BannedUser } from '../../domain/users-banned/users-banned.entity';
import { BannedUserModelType } from '../../domain/users-banned/users-banned.db.types';
import {
  BannedUserInstanceType,
  UserInstanceType,
} from '../repository/users.types.repositories';

@Injectable()
export class BannedUsersRepository {
  constructor(
    @InjectModel(BannedUser.name)
    private BannedUserModel: BannedUserModelType,
  ) {}

  async save(bannedUser: BannedUserInstanceType): Promise<void> {
    await bannedUser.save();
    return;
  }

  async deleteBannedUserById(userId: string): Promise<boolean> {
    const result = await this.BannedUserModel.deleteOne({ userId });
    return result.deletedCount === 1;
  }
}