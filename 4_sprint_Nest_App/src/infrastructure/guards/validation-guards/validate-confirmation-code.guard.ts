import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../../features/users/infrastructure/query.repository/users.query.repository';

@Injectable() //todo validator Constraints
export class ValidateConfirmationCodeGuard implements CanActivate {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersQueryRepository.getUserByCodeConfirmation(
      request.body.code,
    );
    if (!user) {
      throw new BadRequestException([
        { message: 'Code is incorrect', field: 'code' },
      ]); //Code is incorrect
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new BadRequestException([
        { message: 'Code is already expired', field: 'code' },
      ]); //Code is already expired
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        { message: 'Code is already been applied', field: 'code' },
      ]); //Code is already been applied
    }
    request.userId = user._id;

    return true;
  }
}
