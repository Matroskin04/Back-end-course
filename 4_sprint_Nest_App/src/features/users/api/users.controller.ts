import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QueryUserInputModel } from './models/input/query-user.input.model';
import {
  ViewAllUsersModels,
  UserOutputModel,
} from './models/output/user.output.model';
import { CreateUserInputModel } from './models/input/create-user.input.model';
import { UsersQueryRepository } from '../infrastructure/query.repository/users.query.repository';
import { UsersService } from '../application/users.service';
import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../../../infrastructure/utils/enums/http-status';
import { BasicAuthGuard } from '../../../infrastructure/guards/authorization-guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { UpdateBanInfoOfUserInputModel } from './models/input/update-ban-info-of-user.input.model';

@SkipThrottle()
@Controller('/hometask-nest/sa/users')
export class UsersController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected usersService: UsersService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAllUsers(
    @Query() query: QueryUserInputModel,
    @Res({ passthrough: true }) res: Response<ViewAllUsersModels | string>,
  ) {
    const result = await this.usersQueryRepository.getAllUsers(query);
    res.status(HTTP_STATUS_CODE.OK_200).send(result);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(
    @Body() inputUserModel: CreateUserInputModel,
    @Res() res: Response<UserOutputModel | string>,
  ) {
    const result = await this.usersService.createUser(inputUserModel);
    res.status(HTTP_STATUS_CODE.CREATED_201).send(result);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/ban')
  async updateBanInfoOfUser(
    @Param('id') userId: string,
    @Body() inputBanInfo: UpdateBanInfoOfUserInputModel,
    @Res() res: Response<void>,
  ) {
    await this.usersService.updateBanInfoOfUser(userId, inputBanInfo);
    res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string, @Res() res: Response<void>) {
    const result = await this.usersService.deleteSingleUser(userId);

    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }
}
