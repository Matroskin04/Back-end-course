import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { CommentModelType } from '../../domain/comments-db-types';
import { InjectModel } from '@nestjs/mongoose';
import { CommentInstanceType } from './comments-types-repositories';
import { Comment } from '../../domain/comments-schema-model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  async getCommentInstance(
    commentId: ObjectId,
  ): Promise<CommentInstanceType | null> {
    const comment = await this.CommentModel.findOne({ _id: commentId });
    return comment;
  }

  async save(comment: CommentInstanceType): Promise<void> {
    await comment.save();
    return;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.CommentModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async incrementNumberOfLikesOfComment(
    commentId: string,
    incrementValue: 'Like' | 'Dislike',
  ): Promise<boolean> {
    if (incrementValue === 'Like') {
      const result = await this.CommentModel.updateOne(
        { _id: commentId },
        { $inc: { 'likesInfo.likesCount': 1 } },
      );
      return result.modifiedCount === 1;
    } else {
      const result = await this.CommentModel.updateOne(
        { _id: commentId },
        { $inc: { 'likesInfo.dislikesCount': 1 } },
      );
      return result.modifiedCount === 1;
    }
  }

  async decrementNumberOfLikesOfComment(
    _id: string,
    decrementValue: 'Like' | 'Dislike',
  ): Promise<boolean> {
    if (decrementValue === 'Like') {
      const result = await this.CommentModel.updateOne(
        { _id },
        { $inc: { 'likesInfo.likesCount': -1 } },
      );
      return result.modifiedCount === 1;
    } else {
      const result = await this.CommentModel.updateOne(
        { _id },
        { $inc: { 'likesInfo.dislikesCount': -1 } },
      );
      return result.modifiedCount === 1;
    }
  }
}
