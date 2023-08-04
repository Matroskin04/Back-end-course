import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../../users/infrastructure/query.repository/users-query-repository';

@Injectable()
export class ValidateEmailRegistrationGuard implements CanActivate {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userByLogin = await this.usersQueryRepository.getUserByLoginOrEmail(
      request.body.login,
    );
    if (userByLogin) {
      throw new BadRequestException([
        {
          message: `This ${request.body.login} is already exists, point out another`,
          field: 'login',
        },
      ]);
    }
    return true;
  }
}
