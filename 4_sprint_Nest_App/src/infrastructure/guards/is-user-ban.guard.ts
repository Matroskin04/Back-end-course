import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../features/users/infrastructure/query.repository/users.query.repository';

@Injectable()
export class BlogOwnerByIdGuard implements CanActivate {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.body || !request.body.loginOrEmail)
      throw new Error('Login must be passed');

    const user = await this.usersQueryRepository.getUserByLoginOrEmail(
      request.body.loginOrEmail,
    );
    if (!user) throw new UnauthorizedException('User is not found');
    if (user.banInfo.isBanned) return false; //Если забанен - то Forbidden

    return true;
  }
}
