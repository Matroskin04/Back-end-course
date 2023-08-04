import { PostInstanceType } from './posts-types-repositories';
import { ObjectId } from 'mongodb';
import { PostModelType } from '../../domain/posts-db-types';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../domain/posts-schema-model';

export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getPostById(
    postId: ObjectId,
    // userId: ObjectId | null,
  ): Promise<null | PostInstanceType> {
    const post = await this.PostModel.findOne({ _id: postId });
    if (!post) {
      return null;
    }

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

  async incrementNumberOfLikesOfPost(
    postId: string,
    incrementValue: 'Like' | 'Dislike' | 'None',
  ): Promise<boolean> {
    if (incrementValue === 'Like') {
      const result = await this.PostModel.updateOne(
        { _id: postId },
        { $inc: { 'likesInfo.likesCount': 1 } },
      );
      return result.modifiedCount === 1;
    }
    if (incrementValue === 'Dislike') {
      const result = await this.PostModel.updateOne(
        { _id: postId },
        { $inc: { 'likesInfo.dislikesCount': 1 } },
      );
      return result.modifiedCount === 1;
    }
    return true;
  }

  async decrementNumberOfLikesOfPost(
    postId: string,
    decrementValue: 'Like' | 'Dislike' | 'None',
  ): Promise<boolean> {
    if (decrementValue === 'Like') {
      const result = await this.PostModel.updateOne(
        { _id: postId },
        { $inc: { 'likesInfo.likesCount': -1 } },
      );
      return result.modifiedCount === 1;
    }
    if (decrementValue === 'Dislike') {
      const result = await this.PostModel.updateOne(
        { _id: postId },
        { $inc: { 'likesInfo.dislikesCount': -1 } },
      );
      return result.modifiedCount === 1;
    }
    return true;
  }
}
