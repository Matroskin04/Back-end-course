import { SkipThrottle } from '@nestjs/throttler';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../../../../infrastructure/guards/authorization-guards/jwt-access.guard';

@SkipThrottle()
@Controller('/hometask-nest/blogger/users')
export class UsersBloggerController {
  constructor() {}

  // @UseGuards(JwtAccessGuard)
  // @Get('/blog/:blogId')
  // async;
}
