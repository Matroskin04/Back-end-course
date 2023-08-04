import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { LikesInfoRepository } from './likes-info-repository';
import {
  CommentsLikesInfoDBType,
  CommentsLikesInfoModelType,
  PostsLikesInfoDBType,
  PostsLikesInfoModelType,
} from './likes-info-db-types';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsLikesInfo, PostsLikesInfo } from './likes-info-schema-model';

@Injectable()
export class LikesInfoService {
  constructor(
    @InjectModel(CommentsLikesInfo.name)
    private CommentsLikesInfoModel: CommentsLikesInfoModelType,
    @InjectModel(PostsLikesInfo.name)
    private PostsLikesInfoModel: PostsLikesInfoModelType,
    protected likesInfoRepository: LikesInfoRepository,
  ) {}

  async createLikeInfoComment(
    userId: ObjectId,
    commentId: ObjectId,
    statusLike: 'Like' | 'Dislike',
  ): Promise<void> {
    const likeInfoOfComment = this.CommentsLikesInfoModel.createInstance(
      {
        commentId,
        userId,
        statusLike,
      },
      this.CommentsLikesInfoModel,
    );

    await this.likesInfoRepository.createLikeInfoComment(likeInfoOfComment);
    return;
  }

  async createLikeInfoPost(
    userId: ObjectId,
    postId: ObjectId,
    login: string,
    statusLike: 'Like' | 'Dislike',
  ): Promise<void> {
    const likeInfoOfPost = this.PostsLikesInfoModel.createInstance(
      { postId, userId, login, addedAt: new Date().toISOString(), statusLike },
      this.PostsLikesInfoModel,
    );

    await this.likesInfoRepository.save(likeInfoOfPost);
    return;
  }

  async updateLikeInfoComment(
    userId: ObjectId,
    commentId: ObjectId,
    statusLike: 'Like' | 'Dislike',
  ): Promise<boolean> {
    return this.likesInfoRepository.updateLikeInfoComment(
      //todo save
      userId,
      commentId,
      statusLike,
    );
  }

  async updateLikeInfoPost(
    userId: ObjectId,
    postId: ObjectId,
    statusLike: 'Like' | 'Dislike' | 'None',
  ): Promise<boolean> {
    return this.likesInfoRepository.updateLikeInfoPost(
      userId,
      postId,
      statusLike,
    );
  }

  async deleteLikeInfoComment(
    userId: ObjectId,
    commentId: ObjectId,
  ): Promise<boolean> {
    return this.likesInfoRepository.deleteLikeInfoComment(userId, commentId);
  }

  async deleteLikeInfoPost(
    userId: ObjectId,
    postId: ObjectId,
  ): Promise<boolean> {
    return this.likesInfoRepository.deleteLikeInfoComment(userId, postId);
  }
}
