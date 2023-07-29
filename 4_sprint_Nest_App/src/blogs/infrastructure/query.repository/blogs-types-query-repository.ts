import { PostTypeWithId } from '../../../infrastructure/repositories/repositories-types/posts-types-repositories';
import { ViewBlogModel } from '../../api/models/ViewBlogModel';

export type BlogPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<BlogViewType>;
};

export type PostsOfBlogPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostTypeWithId>;
};

export type BlogViewType = ViewBlogModel;
