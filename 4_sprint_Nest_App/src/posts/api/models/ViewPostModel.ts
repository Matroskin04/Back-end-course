import { PostTypeWithId } from '../../infrastructure/repository/posts-types-repositories';

export type ViewPostModel = PostTypeWithId;

export type ViewAllPostsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostTypeWithId>;
};
