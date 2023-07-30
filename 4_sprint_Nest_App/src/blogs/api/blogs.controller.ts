import { QueryBlogModel } from './models/QueryBlogModel';

import {
  ViewAllBlogsModel,
  ViewBlogModel,
  ViewPostsOfBlogModel,
} from './models/ViewBlogModel';
import { CreateBlogModel } from './models/CreateBlogModel';
import { CreatePostByBlogIdModel } from '../../posts/api/models/CreatePostModel';
import { PostTypeWithId } from '../../posts/infrastructure/repository/posts-types-repositories';
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
  Res,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/query.repository/blogs-query-repository';
import { PostsQueryRepository } from '../../posts/infrastructure/query.repository/posts-query-repository';
import { BlogsService } from '../application/blogs-service';
import { PostsService } from '../../posts/application/posts-service';
import { HTTP_STATUS_CODE } from '../../helpers/enums/http-status';
import { Response } from 'express';

@Controller('/hometask-nest/blogs')
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
    @Res() res: Response<ViewAllBlogsModel>,
  ) {
    //todo получить не объектом
    try {
      console.log(query);
      const result = await this.blogsQueryRepository.getAllBlogs(query);
      res.status(HTTP_STATUS_CODE.OK_200).send(result);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Get(':id')
  async getBlogById(
    @Param('id') blogId: string,
    @Res() res: Response<ViewBlogModel>,
  ) {
    try {
      console.log(blogId);
      const result = await this.blogsQueryRepository.getBlogById(blogId);
      result
        ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
        : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
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
    @Res() res: Response<ViewPostsOfBlogModel>,
  ) {
    try {
      const result = await this.postsQueryRepository.getPostsOfBlog(
        blogId,
        query,
      );
      result
        ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
        : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Post()
  async createBlog(
    @Body() inputBlogModel: CreateBlogModel,
    @Res() res: Response<ViewBlogModel>,
  ) {
    try {
      const result = await this.blogsService.createBlog(inputBlogModel);
      res.status(HTTP_STATUS_CODE.CREATED_201).send(result);
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
    @Res() res: Response<PostTypeWithId>, //todo тип
  ) {
    try {
      const result = await this.postsService.createPostByBlogId(
        blogId,
        inputPostModel,
      );
      result
        ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
        : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
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
    @Res() res: Response<void>,
  ) {
    try {
      const result = await this.blogsService.updateBlog(blogId, inputBlogModel);
      result
        ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
        : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string, @Res() res: Response<void>) {
    try {
      const result = await this.blogsService.deleteSingleBlog(blogId);
      result
        ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
        : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }
}
