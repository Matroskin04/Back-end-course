import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import {
  LikeInfoCommentType,
  LikeInfoPostType,
} from './likes-info-types-repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsLikesInfo, PostsLikesInfo } from './likes-info-schema-model';
import {
  CommentsLikesInfoModelType,
  PostsLikesInfoModelType,
} from './likes-info-db-types';

@Injectable()
export class LikesInfoRepository {
  constructor(
    @InjectModel(CommentsLikesInfo.name)
    private CommentsLikesInfoModel: CommentsLikesInfoModelType,
    @InjectModel(PostsLikesInfo.name)
    private PostsLikesInfoModel: PostsLikesInfoModelType,
  ) {}
  async createLikeInfoComment(likeInfo: LikeInfoCommentType): Promise<void> {
    const likesInfoInstance = this.CommentsLikesInfoModel.createInstance(
      likeInfo,
      this.CommentsLikesInfoModel,
    );
    await likesInfoInstance.save();

    return;
  }

  async createLikeInfoPost(likeInfo: LikeInfoPostType): Promise<void> {
    const likesInfoInstance = this.PostsLikesInfoModel.createInstance(
      likeInfo,
      this.PostsLikesInfoModel,
    );
    await likesInfoInstance.save();

    return;
  }

  async updateLikeInfoComment(
    userId: ObjectId,
    commentId: ObjectId,
    statusLike: 'Like' | 'Dislike',
  ): Promise<boolean> {
    const result = await this.CommentsLikesInfoModel.updateOne(
      { userId, commentId },
      { statusLike },
    );
    return result.modifiedCount === 1;
  }

  async updateLikeInfoPost(
    userId: ObjectId,
    postId: ObjectId,
    statusLike: 'Like' | 'Dislike' | 'None',
  ): Promise<boolean> {
    const result = await this.PostsLikesInfoModel.updateOne(
      { userId, postId },
      { statusLike },
    );
    return result.modifiedCount === 1;
  }

  async deleteLikeInfoComment(
    userId: ObjectId,
    commentId: ObjectId,
  ): Promise<boolean> {
    const result = await this.CommentsLikesInfoModel.deleteMany({
      userId,
      commentId,
    });
    return result.deletedCount >= 1;
  }
}
