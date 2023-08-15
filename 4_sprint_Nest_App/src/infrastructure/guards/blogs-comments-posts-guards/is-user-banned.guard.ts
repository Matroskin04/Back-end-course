import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { BannedUsersByBloggerQueryRepository } from '../../../features/users/banned/banned-by-blogger-users/infrastructure/banned-users-by-blogger-query.repository';

@Injectable()
export class IsUserBannedGuard implements CanActivate {
  constructor(
    protected bannedUsersByBloggerQueryRepository: BannedUsersByBloggerQueryRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user?.id) throw new Error('User Id is not found');
    const bannedUser =
      await this.bannedUsersByBloggerQueryRepository.getBannedUserByBlogger(
        request.userId,
      );

    return !bannedUser;
  }
}
