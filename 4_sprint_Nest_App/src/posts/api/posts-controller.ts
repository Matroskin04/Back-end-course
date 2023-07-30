import { QueryPostModel } from './models/QueryPostModel';
import { ViewAllPostsModel, ViewPostModel } from './models/ViewPostModel';
import { PostsQueryRepository } from '../infrastructure/query.repository/posts-query-repository';
import { ViewAllCommentsOfPostModel } from './models/ViewCommentsOfPostModel';
import { CreatePostModel } from './models/CreatePostModel';
import { PostsService } from '../application/posts-service';
import { UpdatePostModel } from './models/UpdatePostModel';
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
import { CommentsQueryRepository } from '../../comments/infrastructure/query.repository/comments-query-repository';
import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../../helpers/enums/http-status';

@Controller('/hometask-nest/posts')
export class PostsController {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected postsService: PostsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  async getAllPosts(
    @Query() query: QueryPostModel,
    @Res() res: Response<ViewAllPostsModel>,
  ) {
    try {
      const result = await this.postsQueryRepository.getAllPosts(query);
      res.status(HTTP_STATUS_CODE.OK_200).send(result);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Get(':id')
  async getPostById(
    @Param('id') postId: string,
    @Res() res: Response<ViewPostModel>,
  ) {
    try {
      const result = await this.postsQueryRepository.getPostById(postId);

      result
        ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
        : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  @Get(':postId/comments')
  async getAllCommentsOfPost(
    @Param('postId') postId: string,
    @Query() query: QueryPostModel,
    @Res() res: Response<ViewAllCommentsOfPostModel>,
  ) {
    try {
      const result = await this.commentsQueryRepository.getCommentsOfPost(
        postId,
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
  async createPost(
    @Body() inputPostModel: CreatePostModel,
    @Res() res: Response<ViewPostModel | string>,
  ) {
    try {
      const result = await this.postsService.createPost(inputPostModel);

      result
        ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
        : res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json('Blog in not found');
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  // async createCommentByPostId(
  //   req: RequestWithParamsAndBody<UriIdModel, CreateCommentByPostIdModel>,
  //   res: Response<ViewCommentOfPostModel>,
  // ) {
  //   try {
  //     const result = await this.commentsService.createCommentByPostId(
  //       req.body,
  //       req.userId!,
  //       req.params.id,
  //     );
  //
  //     result
  //       ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
  //       : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  //   } catch (err) {
  //     throw new InternalServerErrorException(
  //       `Something was wrong. Error: ${err}`,
  //     );
  //   }
  // }

  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() inputPostModel: UpdatePostModel,
    @Res() res: Response<void>,
  ) {
    try {
      const result = await this.postsService.updatePost(postId, inputPostModel);

      result
        ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
        : res.status(HTTP_STATUS_CODE.NOT_FOUND_404);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  // async updateLikeStatusOfPost(
  //   req: RequestWithParamsAndBody<UriIdModel, UpdateLikeStatusModel>,
  //   res: Response<string>,
  // ) {
  //   try {
  //     const result = await this.postsService.updateLikeStatusOfPost(
  //       req.params.id,
  //       req.userId!,
  //       req.body.likeStatus,
  //     );
  //
  //     result
  //       ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
  //       : res
  //           .status(HTTP_STATUS_CODE.NOT_FOUND_404)
  //           .send("Post with specified id doesn't exist");
  //   } catch (err) {
  //     throw new InternalServerErrorException(
  //       `Something was wrong. Error: ${err}`,
  //     );
  //   }
  // }

  @Delete(':id')
  async deletePost(@Param('id') postId: string, @Res() res: Response<void>) {
    try {
      const result = await this.postsService.deleteSinglePost(postId);

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
