import {RequestWithParams, RequestWithParamsAndBody} from "../../types/requests-types";
import {UriIdModel} from "../../models/UriModels";
import {Request, Response} from "express";
import {ViewCommentModel} from "../../models/CommentsModels/ViewCommentModel";
import {UpdateCommentModel} from "../../models/CommentsModels/UpdateCommentModel";
import {HTTP_STATUS_CODE} from "../../helpers/enums/http-status";
import {CommentsQueryRepository} from "../../infrastructure/queryRepository/comments-query-repository";
import {CommentsService} from "../../application/services/comments-service";
import {UpdateLikeStatusModel} from "../../models/CommentsModels/UpdateCommentLikeStatus";
import { injectable } from "inversify";

@injectable()
export class CommentsController {


    constructor(protected commentsQueryRepository: CommentsQueryRepository,
                protected commentsService: CommentsService) {}


    async getCommentById(req: RequestWithParams<UriIdModel>,
                         res: Response<ViewCommentModel>) {

        try {
            const result = await this.commentsQueryRepository.getCommentById(req.params.id, req.userId);

            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async updateComment(req: RequestWithParamsAndBody<UriIdModel, UpdateCommentModel>,
                        res: Response<void>) {

        try {
            await this.commentsService.updateComment(req.params.id, req.userId!.toString(), req.body.content);
            res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async updateLikeStatusOfComment(req: RequestWithParamsAndBody<UriIdModel, UpdateLikeStatusModel>, res: Response<string>) {

        try {
            const result = await this.commentsService.updateLikeStatusOfComment(req.params.id, req.userId!, req.body.likeStatus);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.status(HTTP_STATUS_CODE.NOT_FOUND_404).send('Comment with specified id doesn\'t exist');

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
    }
}

