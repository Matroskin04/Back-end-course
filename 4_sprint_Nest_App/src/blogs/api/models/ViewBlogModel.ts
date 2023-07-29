import { BlogType } from '../../infrastructure/repository/blogs-types-repositories';
import { PostTypeWithId } from '../../../posts/infrastructure/repository/posts-types-repositories';
import { ObjectId } from 'mongodb';

export type ViewBlogModel = BlogType & { id: ObjectId };

export type ViewAllBlogsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<ViewBlogModel>;
};

export type ViewPostsOfBlogModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostTypeWithId>;
};
