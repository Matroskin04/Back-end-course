import { ObjectId } from 'mongodb';
import {
  CommentLikesInfoDocument,
  PostLikesInfoDocument,
} from './likes-info-db-types';

export type CommentLikeInfoType = {
  commentId: ObjectId;
  userId: ObjectId;
  statusLike: 'Like' | 'Dislike';
};

export type LikeInfoPostType = {
  postId: ObjectId;
  userId: ObjectId;
  login: string;
  addedAt: string;
  statusLike: 'Like' | 'Dislike' | 'None';
};

export type PostLikeInfoInstanceType = PostLikesInfoDocument;
export type CommentLikeInfoInstanceType = CommentLikesInfoDocument;
