import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentLikesInfo, PostLikesInfo } from './likes-info-schema-model';

export class CommentsLikesInfoDBType {
  _id: ObjectId;

  commentId: ObjectId;

  userId: ObjectId;

  statusLike: 'Like' | 'Dislike';
}
export type CommentLikesInfoDocument = HydratedDocument<CommentLikesInfo>;

export type CommentLikesInfoModelType = Model<CommentLikesInfoDocument> &
  CommentLikesInfoStaticMethodsType;

export type CommentLikesInfoStaticMethodsType = {
  createInstance: (
    commentLikesInfoDTO: CommentLikesInfoDTOType,
    CommentsLikesInfoModel: CommentLikesInfoModelType,
  ) => CommentLikesInfoDocument;
};
export class CommentLikesInfoDTOType {
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
export type PostLikesInfoDocument = HydratedDocument<PostLikesInfo>;

export type PostLikesInfoModelType = Model<PostLikesInfoDocument> &
  PostsLikesInfoStaticMethodsType;

export type PostsLikesInfoStaticMethodsType = {
  createInstance: (
    postLikesInfoDTO: PostLikesInfoDTOType,
    PostLikesInfoModel: PostLikesInfoModelType,
  ) => PostLikesInfoDocument;
};

export class PostLikesInfoDTOType {
  postId: ObjectId;
  userId: ObjectId;
  login: string;
  addedAt: string;
  statusLike: 'Like' | 'Dislike' | 'None';
}
