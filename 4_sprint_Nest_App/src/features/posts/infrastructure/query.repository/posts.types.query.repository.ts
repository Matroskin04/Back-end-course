import {
  NewestLikesType,
  PostTypeWithId,
} from '../repository/posts.types.repositories';
import { CommentViewType } from '../../../comments/infrastructure/repository/comments.types.repositories';
import { PostDBType } from '../../domain/posts.db.types';

export type PostPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostTypeWithId>;
};

export type CommentOfPostPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<CommentViewType>;
};

export type PostViewType = PostTypeWithId & {
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: 'None' | 'Like' | 'Dislike';
    newestLikes: NewestLikesType;
  };
};

export type PostsDBType = Array<PostDBType>;