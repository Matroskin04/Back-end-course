import { BodyBlogType } from '../infrastructure/repository/blogs-types-repositories';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModelType } from '../domain/blogs.db.types';
import { Blog } from '../domain/blogs-schema-model';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/repository/blogs-repository';
import { BlogViewType } from '../infrastructure/query.repository/blogs-types-query-repository';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    protected blogsRepository: BlogsRepository,
  ) {}

  async createBlog(inputBodyBlog: BodyBlogType): Promise<BlogViewType> {
    const blog = this.BlogModel.createInstance(inputBodyBlog, this.BlogModel);
    await this.blogsRepository.save(blog);

    return blog.modifyIntoViewModel();
  }

  async updateBlog(id: string, inputBodyBlog: BodyBlogType): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogById(new ObjectId(id));
    if (!blog) {
      return false;
    }

    blog.updateBlogInfo(blog, inputBodyBlog);
    await this.blogsRepository.save(blog);

    return true;
  }

  async deleteSingleBlog(id: string): Promise<boolean> {
    return this.blogsRepository.deleteSingleBlog(new ObjectId(id));
  }
}
