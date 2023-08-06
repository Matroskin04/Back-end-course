import { PostTypeWithId } from '../../../posts/infrastructure/repository/posts.types.repositories';
import { BlogOutputModel } from '../../api/models/output/blog.output.model';

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

export type BlogViewType = BlogOutputModel;
