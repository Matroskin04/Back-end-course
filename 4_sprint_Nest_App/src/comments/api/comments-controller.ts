import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { ViewCommentModel } from './models/ViewCommentModel';
import { CommentsQueryRepository } from '../infrastructure/query.repository/comments-query-repository';

@Controller('/hometask-nest/comments')
export class CommentsController {
  constructor(
    protected commentsQueryRepository: CommentsQueryRepository, // protected commentsService: CommentsService,
  ) {}

  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
  ): Promise<ViewCommentModel | null | undefined> {
    try {
      const result = await this.commentsQueryRepository.getCommentById(
        commentId,
      );

      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something was wrong. Error: ${err}`,
      );
    }
  }

  /*async updateComment(
    req: RequestWithParamsAndBody<UriIdModel, UpdateCommentModel>,
    res: Response<void>,
  ) {
    try {
      await this.commentsService.updateComment(
        req.params.id,
        req.userId!.toString(),
        req.body.content,
      );
      res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
    } catch (err) {
      console.log(`Something was wrong. Error: ${err}`);
    }
  }

  async updateLikeStatusOfComment(
    req: RequestWithParamsAndBody<UriIdModel, UpdateLikeStatusModel>,
    res: Response<string>,
  ) {
    try {
      const result = await this.commentsService.updateLikeStatusOfComment(
        req.params.id,
        req.userId!,
        req.body.likeStatus,
      );

      result
        ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
        : res
            .status(HTTP_STATUS_CODE.NOT_FOUND_404)
            .send("Comment with specified id doesn't exist");
    } catch (err) {
      console.log(`Something was wrong. Error: ${err}`);
    }
  }

  async deleteComment(req: Request, res: Response<void>) {
    try {
      await this.commentsService.deleteComment(req.params.id);
      res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
    } catch (err) {
      console.log(`Something was wrong. Error: ${err}`);
    }
  }*/
}
