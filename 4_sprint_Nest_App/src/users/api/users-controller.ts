import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { QueryUserModel } from './models/QueryUserModel';
import { ViewAllUsersModels, ViewUserModel } from './models/ViewUserModel';
import { CreateUserModel } from './models/CreateUserModel';
import { UsersQueryRepository } from '../infrastructure/query.repository/users-query-repository';
import { UsersService } from '../application/users-service';

@Controller('/hometask-nest/users')
export class UsersController {
  constructor(
    protected usersQueryRepository: UsersQueryRepository,
    protected usersService: UsersService,
  ) {}

  @Get()
  async getAllUsers(
    @Query() query: QueryUserModel,
  ): Promise<ViewAllUsersModels | undefined> {
    try {
      const result = await this.usersQueryRepository.getAllUsers(query);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Post()
  async createUser(
    @Body() inputUserModel: CreateUserModel,
  ): Promise<ViewUserModel | null> {
    try {
      const result = await this.usersService.createUser(inputUserModel);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<boolean> {
    try {
      const result = await this.usersService.deleteSingleUser(userId);

      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }
}
