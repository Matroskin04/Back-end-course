import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QueryUserModel } from './models/QueryUserModel';
import { ViewAllUsersModels, ViewUserModel } from './models/ViewUserModel';
import { CreateUserModel } from './models/CreateUserModel';
import { UsersQueryRepository } from '../infrastructure/query.repository/users-query-repository';
import { UsersService } from '../application/users-service';
import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../../../infrastructure/helpers/enums/http-status';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('/hometask-nest/users')
export class UsersController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected usersService: UsersService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAllUsers(
    //todo try catch не нужны в nest?
    @Query() query: QueryUserModel,
    @Res() res: Response<ViewAllUsersModels | string>,
  ) {
    const result = await this.usersQueryRepository.getAllUsers(query);
    res.status(HTTP_STATUS_CODE.OK_200).send(result);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(
    @Body() inputUserModel: CreateUserModel,
    @Res() res: Response<ViewUserModel | string>,
  ) {
    const result = await this.usersService.createUser(inputUserModel);
    res.status(HTTP_STATUS_CODE.CREATED_201).send(result);
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
