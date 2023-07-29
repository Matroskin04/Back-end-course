import { QueryBlogModel } from './models/QueryBlogModel';

import {
  ViewAllBlogsModel,
  ViewBlogModel,
  ViewPostsOfBlogModel,
} from './models/ViewBlogModel';
import { UriIdModel } from '../../models/UriModels';
import { UriBlogIdModel } from './models/UriBlogModel';
import { CreateBlogModel } from './models/CreateBlogModel';
import { CreatePostByBlogIdModel } from '../../posts/api/models/CreatePostModel';
import { PostTypeWithId } from '../../infrastructure/repositories/repositories-types/posts-types-repositories';
import { UpdateBlogModel } from './models/UpdateBlogModel';

import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/query.repository/blogs-query-repository';
import { PostsQueryRepository } from '../../posts/infrastructure/query.repository/posts-query-repository';
import { BlogsService } from '../application/blogs-service';
import { PostsService } from '../../posts/application/posts-service';

@Controller('/hometask-03/blogs')
export class BlogsController {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: QueryBlogModel,
  ): Promise<ViewAllBlogsModel | undefined> {
    //todo получить не объектом
    try {
      console.log(query);
      const result = await this.blogsQueryRepository.getAllBlogs(query);
      return result;
    } catch (err) {
      console.log(`Something was wrong. Error: ${err}`);
    }
  }

  @Get(':id')
  async getBlogById(
    @Param('id') blogId: string,
  ): Promise<ViewBlogModel | null> {
    try {
      console.log(blogId);
      const result = await this.blogsQueryRepository.getBlogById(blogId);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Get(':blogId/posts')
  async getAllPostsOfBlog(
    @Param('blogId') blogId: string,
    @Query() query: QueryBlogModel,
  ): Promise<ViewPostsOfBlogModel | null> {
    try {
      const result = await this.postsQueryRepository.getPostsOfBlog(
        blogId,
        query,
      );
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Post()
  async createBlog(
    @Body() inputBlogModel: CreateBlogModel,
  ): Promise<ViewBlogModel> {
    try {
      const result = await this.blogsService.createBlog(inputBlogModel);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Post(`/:blogId/posts`)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: CreatePostByBlogIdModel,
  ): Promise<PostTypeWithId | null> {
    try {
      const result = await this.postsService.createPostByBlogId(
        blogId,
        inputPostModel,
      );
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputBlogModel: UpdateBlogModel,
  ): Promise<boolean> {
    try {
      const result = await this.blogsService.updateBlog(blogId, inputBlogModel);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Delete()
  async deleteBlog(@Param('id') blogId: string): Promise<boolean> {
    try {
      const result = await this.blogsService.deleteSingleBlog(blogId);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }
}
