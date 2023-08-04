import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';
import { CommentsLikesInfo, PostsLikesInfo } from './likes-info-schema-model';

export class CommentsLikesInfoDBType {
  _id: ObjectId;

  commentId: ObjectId;

  userId: ObjectId;

  statusLike: 'Like' | 'Dislike';
}
export type CommentLikesInfoDocument = HydratedDocument<CommentsLikesInfo>;

export type CommentsLikesInfoModelType = Model<CommentLikesInfoDocument> &
  CommentsLikesInfoStaticMethodsType;

export type CommentsLikesInfoStaticMethodsType = {
  createInstance: (
    commentLikesInfoDTO: CommentsLikesInfoDTOType,
    CommentsLikesInfoModel: CommentsLikesInfoModelType,
  ) => CommentLikesInfoDocument;
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
export type PostLikesInfoDocument = HydratedDocument<PostsLikesInfo>;

export type PostsLikesInfoModelType = Model<PostLikesInfoDocument> &
  PostsLikesInfoStaticMethodsType;

export type PostsLikesInfoStaticMethodsType = {
  createInstance: (
    commentLikesInfoDTO: PostsLikesInfoDTOType,
    CommentsLikesInfoModel: PostsLikesInfoModelType,
  ) => PostLikesInfoDocument;
};

export class PostsLikesInfoDTOType {
  postId: ObjectId;
  userId: ObjectId;
  login: string;
  addedAt: string;
  statusLike: 'Like' | 'Dislike' | 'None';
}
