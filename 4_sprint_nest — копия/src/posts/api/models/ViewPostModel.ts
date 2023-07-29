import { PostTypeWithId } from '../../../infrastructure/repositories/repositories-types/posts-types-repositories';

export type ViewPostModel = PostTypeWithId;

export type ViewAllPostsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostTypeWithId>;
};
