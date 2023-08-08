import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { BlogsSAQueryRepository } from '../../features/blogs/super-admin-blogs/infrastructure/query.repository/blogs-sa.query.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogOwnerByIdGuard implements CanActivate {
  constructor(protected blogsSAQueryRepository: BlogsSAQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.userId) throw new Error('userId is not found');

    const blog = await this.blogsSAQueryRepository.getBlogById(
      new ObjectId(request.params.blogId),
    );
    if (!blog) throw new NotFoundError('This blog is not found');

    return blog.blogOwnerInfo.userId === request.userId;
  }
}
