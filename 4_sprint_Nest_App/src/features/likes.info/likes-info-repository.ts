import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import {
  CommentLikeInfoInstanceType,
  PostLikeInfoInstanceType,
} from './likes-info-types-repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLikesInfo, PostLikesInfo } from './likes-info-schema-model';
import {
  CommentLikesInfoModelType,
  PostLikesInfoModelType,
} from './likes-info-db-types';
import { Comment } from '../comments/domain/comments-schema-model';
import { CommentModelType } from '../comments/domain/comments-db-types';
import { Post } from '../posts/domain/posts-schema-model';
import { PostModelType } from '../posts/domain/posts-db-types';

@Injectable()
export class LikesInfoRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(CommentLikesInfo.name)
    private CommentsLikesInfoModel: CommentLikesInfoModelType,
    @InjectModel(PostLikesInfo.name)
    private PostsLikesInfoModel: PostLikesInfoModelType,
  ) {}

  async getCommentLikeInfoInstance(
    commentId: ObjectId,
    userId: ObjectId,
  ): Promise<CommentLikeInfoInstanceType | null> {
    const commentLikeInfo = await this.CommentsLikesInfoModel.findOne({
      commentId,
      userId,
    });

    if (!commentLikeInfo) return null;
    return commentLikeInfo;
  }

  async getPostLikeInfoInstance(
    postId: ObjectId,
    userId: ObjectId,
  ): Promise<PostLikeInfoInstanceType | null> {
    const postLikeInfo = await this.PostsLikesInfoModel.findOne({
      postId,
      userId,
    });

    if (!postLikeInfo) return null;
    return postLikeInfo;
  }

  async save(
    likeInfo: PostLikeInfoInstanceType | CommentLikeInfoInstanceType,
  ): Promise<void> {
    await likeInfo.save();

    return;
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

  async deleteLikeInfoComment(
    userId: ObjectId,
    commentId: ObjectId,
  ): Promise<boolean> {
    const result = await this.CommentsLikesInfoModel.deleteOne({
      userId,
      commentId,
    });
    return result.deletedCount === 1;
  }
}
