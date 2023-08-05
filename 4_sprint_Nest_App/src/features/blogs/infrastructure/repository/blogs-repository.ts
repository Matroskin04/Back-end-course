import { ObjectId } from 'mongodb';
import { BlogInstanceType } from './blogs-types-repositories';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModelType } from '../../domain/blogs.db.types';
import { Blog } from '../../domain/blogs-schema-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}
  async save(blog: BlogInstanceType): Promise<void> {
    await blog.save();
    return;
  }

  async deleteSingleBlog(blogId: ObjectId): Promise<boolean> {
    const result = await this.BlogModel.deleteOne({ _id: blogId });
    return result.deletedCount === 1;
  }

  async getBlogInstance(blogId: ObjectId): Promise<null | BlogInstanceType> {
    const blog = await this.BlogModel.findOne({ _id: blogId });

    if (blog) {
      return blog;
    }
    return null;
  }
}
