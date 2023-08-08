import { PostInstanceType } from './posts.types.repositories';
import { ObjectId } from 'mongodb';
import { PostModelType } from '../../domain/posts.db.types';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/posts.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getPostById(postId: ObjectId): Promise<null | PostInstanceType> {
    const post = await this.PostModel.findOne({ _id: postId });
    return post;
  }

  async save(post: PostInstanceType): Promise<void> {
    await post.save();
    return;
  }

  async deleteSinglePost(id: ObjectId): Promise<boolean> {
    const result = await this.PostModel.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount === 1;
  }

  async deletePostsByUserId(blogId: ObjectId): Promise<boolean> {
    const result = await this.PostModel.deleteMany({ blogId });
    return result.deletedCount > 0;
  }
}
