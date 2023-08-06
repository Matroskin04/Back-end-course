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
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/query.repository/blogs-query-repository';
import { PostsQueryRepository } from '../../posts/infrastructure/query.repository/posts-query-repository';
import { BlogsService } from '../application/blogs-service';
import { PostsService } from '../../posts/application/posts-service';
import { HTTP_STATUS_CODE } from '../../../infrastructure/helpers/enums/http-status';
import { Response } from 'express';
import { JwtAccessNotStrictGuard } from '../../auth/guards/jwt-access-not-strict.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id.param.decorator';
import { ObjectId } from 'mongodb';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
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
    //todo попробовать получить не объектом
    const result = await this.blogsQueryRepository.getAllBlogs(query);
    res.status(HTTP_STATUS_CODE.OK_200).send(result);
  }

  @Get(':id')
  async getBlogById(
    @Param('id') blogId: string,
    @Res() res: Response<ViewBlogModel>,
  ) {
    const result = await this.blogsQueryRepository.getBlogById(blogId);
    result
      ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessNotStrictGuard)
  @Get(':blogId/posts')
  async getAllPostsOfBlog(
    @Param('blogId') blogId: string,
    @CurrentUserId() userId: ObjectId,
    @Query() query: QueryBlogModel,
    @Res() res: Response<ViewPostsOfBlogModel>,
  ) {
    const result = await this.postsQueryRepository.getPostsOfBlog(
      blogId,
      query,
      userId,
    );
    result
      ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(
    @Body() inputBlogModel: CreateBlogModel,
    @Res() res: Response<ViewBlogModel>,
  ) {
    const result = await this.blogsService.createBlog(inputBlogModel);
    res.status(HTTP_STATUS_CODE.CREATED_201).send(result);
  }

  @UseGuards(BasicAuthGuard)
  @Post(`/:blogId/posts`)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: CreatePostByBlogIdModel,
    @Res() res: Response<PostTypeWithId>, //todo тип
  ) {
    const result = await this.postsService.createPostByBlogId(
      blogId,
      inputPostModel,
    );
    result
      ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputBlogModel: UpdateBlogModel,
    @Res() res: Response<void>,
  ) {
    const result = await this.blogsService.updateBlog(blogId, inputBlogModel);
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string, @Res() res: Response<void>) {
    const result = await this.blogsService.deleteSingleBlog(blogId);
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }
}
