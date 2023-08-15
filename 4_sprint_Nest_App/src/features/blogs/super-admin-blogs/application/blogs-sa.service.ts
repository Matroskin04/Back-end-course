import { InjectModel } from '@nestjs/mongoose';
import { BlogModelType } from '../../domain/blogs.db.types';
import { Blog } from '../../domain/blogs.entity';
import { Injectable } from '@nestjs/common';
import { BlogsSARepository } from '../infrastructure/repository/blogs-sa-repository';
import { ObjectId } from 'mongodb';
import { UsersSAQueryRepository } from '../../../users/super-admin/infrastructure/query.repository/users-sa.query.repository';

@Injectable()
export class BlogsSAService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    protected blogsSARepository: BlogsSARepository,
    protected usersQueryRepository: UsersSAQueryRepository,
  ) {}

  async bindBlogWithUser(blogId: string, userId: string): Promise<boolean> {
    const user = await this.usersQueryRepository.getUserByUserId(
      new ObjectId(userId),
    );

    if (!user) {
      return false;
    }

    const blog = await this.blogsSARepository.getBlogInstance(
      new ObjectId(blogId),
    );
    if (!blog || blog.blogOwnerInfo) return false; //Если нет блога или юзер уже привязан

    blog.blogOwnerInfo = {
      userId,
      userLogin: user.login,
    };
    await this.blogsSARepository.save(blog);

    return true;
  }
  /* async createBlog(inputBodyBlog: BodyBlogType): Promise<BlogViewType> {
    const blog = this.BlogModel.createInstance(inputBodyBlog, this.BlogModel);
    await this.blogsRepository.save(blog);

    return blog.modifyIntoViewModel();
  }

  async updateBlog(id: string, inputBodyBlog: BodyBlogType): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogInstance(new ObjectId(id));
    if (!blog) {
      return false;
    }

    blog.updateBlogInfo(blog, inputBodyBlog);
    await this.blogsRepository.save(blog);

    return true;
  }

  async deleteSingleBlog(id: string): Promise<boolean> {
    return this.blogsRepository.deleteSingleBlog(new ObjectId(id));
  }*/
}
