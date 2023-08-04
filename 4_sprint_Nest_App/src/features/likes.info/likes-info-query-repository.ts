import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import {
  CommentsLikesInfoDBType,
  PostsLikesInfoDBType,
} from './likes-info-db-types';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsLikesInfo, PostsLikesInfo } from './likes-info-schema-model';
import { NewestLikesType } from '../posts/infrastructure/repository/posts-types-repositories';

@Injectable()
export class LikesInfoQueryRepository {
  constructor(
    @InjectModel(CommentsLikesInfo.name)
    private CommentsLikesInfoModel,
    @InjectModel(PostsLikesInfo.name)
    private PostsLikesInfoModel,
  ) {}
  async getLikesInfoByCommentAndUser(
    commentId: ObjectId,
    userId: ObjectId,
  ): Promise<CommentsLikesInfoDBType | null> {
    return this.CommentsLikesInfoModel.findOne({ commentId, userId });
  }

  async getLikesInfoByPostAndUser(
    postId: ObjectId,
    userId: ObjectId,
  ): Promise<PostsLikesInfoDBType | null> {
    return this.PostsLikesInfoModel.findOne({ postId, userId });
  }

  async getNewestLikesOfPost(postId: ObjectId): Promise<NewestLikesType> {
    return this.PostsLikesInfoModel.find({ postId, statusLike: 'Like' })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
  }
}
