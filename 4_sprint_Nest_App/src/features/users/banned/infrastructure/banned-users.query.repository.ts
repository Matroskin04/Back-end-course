import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BannedUser } from '../domain/users-banned.entity';
import {
  BannedUserDTOType,
  BannedUserModelType,
} from '../domain/users-banned.db.types';

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
