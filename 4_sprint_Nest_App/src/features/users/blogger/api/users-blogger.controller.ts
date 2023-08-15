import { SkipThrottle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../../../../infrastructure/guards/authorization-guards/jwt-access.guard';
import { UpdateBanInfoOfUserInputModel } from './models/input/update-ban-info-of-user.input.model';
import { UsersBloggerService } from '../application/users-blogger.service';
import { UsersBloggerQueryRepository } from '../infrastructure/query.repository/users-blogger.query.repository';
import { QueryUsersBloggerInputModel } from './models/input/query-users-blogger.input.model';

@SkipThrottle()
@Controller('/hometask-nest/blogger/users')
export class UsersBloggerController {
  constructor(
    protected usersBloggerService: UsersBloggerService,
    protected usersBloggerQueryRepository: UsersBloggerQueryRepository,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Get('/blog/:blogId')
  async getBannedUsersOfBlog(
    @Query() query: QueryUsersBloggerInputModel,
    @Param('blogId') blogId: string,
  ) {
    const result = await this.usersBloggerQueryRepository.getBannedUsersOfBlog(
      query,
      blogId,
    );
    return result;
  }

  @UseGuards(JwtAccessGuard)
  @HttpCode(204)
  @Put(':userId/ban')
  async updateBanInfoOfUser(
    @Param('userId') userId: string,
    @Body() inputBanInfoModel: UpdateBanInfoOfUserInputModel,
  ) {
    await this.usersBloggerService.updateBanInfoOfUser(
      userId,
      inputBanInfoModel,
    );
    return;
  }
}
