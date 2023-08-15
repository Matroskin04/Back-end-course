import { SkipThrottle } from '@nestjs/throttler';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BanInfoBloggerType } from './dto/ban-info.dto';
import { UsersBloggerRepository } from '../infrastructure/repository/users-blogger.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BannedUsersByBlogger } from '../../banned/banned-by-blogger-users/domain/users-banned-by-blogger.entity';
import { BannedUsersByBloggerModelType } from '../../banned/banned-by-blogger-users/domain/users-banned-by-blogger.db.types';

@Injectable()
@SkipThrottle()
export class UsersBloggerService {
  constructor(
    @InjectModel(BannedUsersByBlogger.name)
    private BannedUsersByBloggerModel: BannedUsersByBloggerModelType,
    protected usersBloggerRepository: UsersBloggerRepository,
  ) {}

  async updateBanInfoOfUser(
    userId: string,
    banInfo: BanInfoBloggerType,
  ): Promise<void> {
    const bannedUsersByBlogger =
      await this.usersBloggerRepository.getBannedUsersByBlogIdInstance(
        banInfo.blogId,
      );

    if (banInfo.isBanned) {
      //check of existing info about banned users
      if (!bannedUsersByBlogger) {
        const newBannedUsersByBlogger =
          this.BannedUsersByBloggerModel.createInstance(
            banInfo.blogId,
            userId,
            this.BannedUsersByBloggerModel,
          );
        await this.usersBloggerRepository.save(newBannedUsersByBlogger);
        return;
      }
      //if info exist, check existing userId in this list info
      if (bannedUsersByBlogger.bannedUsers.indexOf(userId) > -1)
        throw new BadRequestException([
          {
            message: `User is already banned`,
            field: 'isBanned',
          },
        ]);

      //if this userId is not exist, so add
      bannedUsersByBlogger.bannedUsers.push(userId);
      await this.usersBloggerRepository.save(bannedUsersByBlogger);
      return;
    }

    //!!!if banInfo.isBanned === false:!!!
    //check of existing info about banned users
    if (!bannedUsersByBlogger)
      throw new BadRequestException([
        {
          message: `User is already unbanned`,
          field: 'isBanned',
        },
      ]);

    //if info exist, check existing userId in this list info
    if (bannedUsersByBlogger.bannedUsers.indexOf(userId) === -1)
      throw new BadRequestException([
        {
          message: `User is already unbanned`,
          field: 'isBanned',
        },
      ]);

    //if this UserId exists, so delete it:
    const result = await this.usersBloggerRepository.deleteBannedUserFromList(
      banInfo.blogId,
      userId,
    );
    if (!result) throw new Error('Deletion failed');
    return;
  }
}
