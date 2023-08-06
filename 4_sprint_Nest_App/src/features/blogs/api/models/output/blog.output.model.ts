import { BlogType } from '../../../infrastructure/repository/blogs.types.repositories';
import { PostTypeWithId } from '../../../../posts/infrastructure/repository/posts.types.repositories';
import { ObjectId } from 'mongodb';

export type BlogOutputModel = BlogType & { id: ObjectId };

export type ViewAllBlogsModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<BlogOutputModel>;
};

export type ViewPostsOfBlogModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<PostTypeWithId>;
};
