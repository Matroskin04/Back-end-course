import { SkipThrottle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../../../../infrastructure/guards/authorization-guards/jwt-access.guard';
import { UpdateBanInfoOfUserInputModel } from './models/input/update-ban-info-of-user.input.model';
import { UsersBloggerService } from '../application/users-blogger.service';

@SkipThrottle()
@Controller('/hometask-nest/blogger/users')
export class UsersBloggerController {
  constructor(protected usersBloggerService: UsersBloggerService) {}

  // @UseGuards(JwtAccessGuard)
  // @Get('/blog/:blogId')
  // async;

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
