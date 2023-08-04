import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentsLikesInfo, PostsLikesInfo } from './likes-info-schema-model';

export class CommentsLikesInfoDBType {
  _id: ObjectId;

  commentId: ObjectId;

  userId: ObjectId;

  statusLike: 'Like' | 'Dislike';
}
export type CommentsLikesInfoDocument = HydratedDocument<CommentsLikesInfo>;

export type CommentsLikesInfoModelType = Model<CommentsLikesInfoDocument> &
  CommentsLikesInfoStaticMethodsType;

export type CommentsLikesInfoStaticMethodsType = {
  createInstance: (
    commentLikesInfoDTO: CommentsLikesInfoDTOType,
    CommentsLikesInfoModel: CommentsLikesInfoModelType,
  ) => CommentsLikesInfoDocument;
};
export class CommentsLikesInfoDTOType {
  commentId: ObjectId;
  userId: ObjectId;
  statusLike: 'Like' | 'Dislike';
}

export class PostsLikesInfoDBType {
  _id: ObjectId;

  postId: ObjectId;

  userId: ObjectId;

  login: string;

  addedAt: string;

  statusLike: 'Like' | 'Dislike' | 'None';
}
export type PostsLikesInfoDocument = HydratedDocument<PostsLikesInfo>;

export type PostsLikesInfoModelType = Model<PostsLikesInfoDocument> &
  PostsLikesInfoStaticMethodsType;

export type PostsLikesInfoStaticMethodsType = {
  createInstance: (
    commentLikesInfoDTO: PostsLikesInfoDTOType,
    CommentsLikesInfoModel: PostsLikesInfoModelType,
  ) => PostsLikesInfoDocument;
};

export class PostsLikesInfoDTOType {
  postId: ObjectId;
  userId: ObjectId;
  login: string;
  addedAt: string;
  statusLike: 'Like' | 'Dislike' | 'None';
}
