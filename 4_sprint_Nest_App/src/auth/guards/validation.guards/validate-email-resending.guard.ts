import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../../users/infrastructure/query.repository/users-query-repository';

@Injectable()
export class ValidateEmailResendingGuard implements CanActivate {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersQueryRepository.getUserByLoginOrEmail(
      request.body.email,
    );
    if (!user) {
      throw new Error('This email has not been registered yet');
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new Error('Email is already confirmed');
    }
    request.userId = user._id;

    return true;
  }
}
