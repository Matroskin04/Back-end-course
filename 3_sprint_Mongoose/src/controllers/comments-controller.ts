import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests-types";
import {UriIdModel} from "../models/UriModels";
import {Request, Response} from "express";
import {ViewCommentModel} from "../models/CommentsModels/ViewCommentModel";
import {UpdateCommentModel} from "../models/CommentsModels/UpdateCommentModel";
import {HTTP_STATUS_CODE} from "../helpers/http-status";
import {CommentsQueryRepository} from "../queryRepository/comments-query-repository";
import {CommentsService} from "../domain/comments-service";


class CommentsController {

    commentsQueryRepository: CommentsQueryRepository
    commentsService: CommentsService

    constructor() {
        this.commentsService = new CommentsService()
        this.commentsQueryRepository = new CommentsQueryRepository()
    }


    async getCommentById(req: RequestWithParams<UriIdModel>,
                         res: Response<ViewCommentModel>) {

        try {
            const result = await this.commentsQueryRepository.getCommentById(req.params.id);

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

    async deleteComment(req: Request, res: Response<void>) {

        try {
            await this.commentsService.deleteOne(req.params.id);
            res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}

export const commentsController = new CommentsController()