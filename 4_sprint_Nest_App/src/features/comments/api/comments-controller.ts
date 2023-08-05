import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ViewCommentModel } from './models/ViewCommentModel';
import { CommentsQueryRepository } from '../infrastructure/query.repository/comments-query-repository';
import { HTTP_STATUS_CODE } from '../../../helpers/enums/http-status';
import { Response } from 'express';
import { CommentsService } from '../application/comments-service';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { JwtAccessNotStrictGuard } from '../../auth/guards/jwt-access-not-strict.guard';
import { CurrentUserId } from '../../auth/decorators/current-user-id.param.decorator';
import { ObjectId } from 'mongodb';
import { UpdateCommentModel } from './models/UpdateCommentModel';
import { UpdateCommentLikeStatusModel } from './models/UpdateCommentLikeStatusModel';

@Controller('/hometask-nest/comments')
export class CommentsController {
  constructor(
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentsService: CommentsService,
  ) {}

  @UseGuards(JwtAccessNotStrictGuard)
  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<ViewCommentModel>,
  ) {
    const result = await this.commentsQueryRepository.getCommentById(
      commentId,
      userId,
    );

    result
      ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard) //todo addition guard
  @Put(':id')
  async updateComment(
    @Param('id') commentId: ObjectId,
    @CurrentUserId() userId: string,
    @Body() inputCommentModel: UpdateCommentModel,
    @Res() res: Response<void>,
  ) {
    const result = await this.commentsService.updateComment(
      commentId,
      userId,
      inputCommentModel.content,
    );
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }

  @UseGuards(JwtAccessGuard)
  @Put(':id/like-status')
  async updateLikeStatusOfComment(
    @Param('id') commentId: string,
    @CurrentUserId() userId: ObjectId,
    @Body() inputLikeInfoModel: UpdateCommentLikeStatusModel,
    @Res() res: Response<string>,
  ) {
    const result = await this.commentsService.updateLikeStatusOfComment(
      commentId,
      userId,
      inputLikeInfoModel.likeStatus,
    );

    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res
          .status(HTTP_STATUS_CODE.NOT_FOUND_404)
          .send("Comment with specified id doesn't exist");
  }

  @UseGuards(JwtAccessGuard) //todo addition guard
  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @CurrentUserId() userId: string,
    @Res() res: Response<void>,
  ) {
    const result = await this.commentsService.deleteComment(commentId, userId);
    result
      ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
      : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
  }
}
