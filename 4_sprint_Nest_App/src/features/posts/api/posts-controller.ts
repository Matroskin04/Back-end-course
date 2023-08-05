import { QueryPostModel } from './models/QueryPostModel';
import { ViewAllPostsModel, ViewPostModel } from './models/ViewPostModel';
import { PostsQueryRepository } from '../infrastructure/query.repository/posts-query-repository';
import {
  ViewAllCommentsOfPostModel,
  ViewCommentOfPostModel,
} from './models/ViewCommentsOfPostModel';
import { CreatePostModel } from './models/CreatePostModel';
import { PostsService } from '../application/posts-service';
import { UpdatePostModel } from './models/UpdatePostModel';
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
import { CommentsQueryRepository } from '../../comments/infrastructure/query.repository/comments-query-repository';
import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../../../helpers/enums/http-status';
import { JwtAccessNotStrictGuard } from '../../auth/guards/jwt-access-not-strict.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id.param.decorator';
import { ObjectId } from 'mongodb';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { CreateCommentByPostIdModel } from '../../comments/api/models/CreateCommentModel';
import { CommentsService } from '../../comments/application/comments-service';
import { UpdatePostLikeStatusModel } from './models/UpdateLikeStatusModel';

@Controller('/hometask-nest/posts')
export class PostsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected postsService: PostsService,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentsService: CommentsService,
  ) {}

  @UseGuards(JwtAccessNotStrictGuard)
  @Get()
  async getAllPosts(
    @Query() query: QueryPostModel,
    @CurrentUserId() userId: ObjectId | null,
    @Res() res: Response<ViewAllPostsModel>,
  ) {
    const result = await this.postsQueryRepository.getAllPosts(query, userId);
    res.status(HTTP_STATUS_CODE.OK_200).send(result);
  }

  @UseGuards(JwtAccessNotStrictGuard)
  @Get(':id')
  async getPostById(
    @Param('id') postId: string,
    @CurrentUserId() userId: ObjectId | null,
    @Res() res: Response<ViewPostModel>,
  ) {
    const result = await this.postsQueryRepository.getPostById(
      new ObjectId(postId),
      userId,
    );

    result
      ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessNotStrictGuard)
  @Get(':postId/comments')
  async getAllCommentsOfPost(
    @Param('postId') postId: string,
    @CurrentUserId() userId: ObjectId | null,
    @Query() query: QueryPostModel,
    @Res() res: Response<ViewAllCommentsOfPostModel>,
  ) {
    const result = await this.commentsQueryRepository.getCommentsOfPost(
      postId,
      query,
      userId,
    );
    result
      ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(
    @Body() inputPostModel: CreatePostModel,
    @Res() res: Response<ViewPostModel | string>,
  ) {
    const result = await this.postsService.createPost(inputPostModel);

    result
      ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
      : res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json('Blog in not found');
  }

  @UseGuards(JwtAccessGuard)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Param('postId') postId: string,
    @CurrentUserId() userId: ObjectId,
    @Body() inputCommentModel: CreateCommentByPostIdModel,
    @Res() res: Response<ViewCommentOfPostModel>,
  ) {
    const result = await this.commentsService.createCommentByPostId(
      inputCommentModel.content,
      userId,
      postId,
    );

    result
      ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() inputPostModel: UpdatePostModel,
    @Res() res: Response<void>,
  ) {
    const result = await this.postsService.updatePost(postId, inputPostModel);

    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard)
  @Put(':postId/like-status')
  async updateLikeStatusOfPost(
    @Param('postId') postId: string,
    @CurrentUserId() userId: ObjectId,
    @Body() inputLikeStatusModel: UpdatePostLikeStatusModel,
    @Res() res: Response<string>,
  ) {
    const result = await this.postsService.updateLikeStatusOfPost(
      postId.toString(),
      userId,
      inputLikeStatusModel.likeStatus,
    );

    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res
          .status(HTTP_STATUS_CODE.NOT_FOUND_404)
          .send("Post with specified id doesn't exist");
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') postId: string, @Res() res: Response<void>) {
    const result = await this.postsService.deleteSinglePost(postId);

    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }
}
