import { ObjectId } from 'mongodb';

export type L5ikeInfoCommentType = {
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
