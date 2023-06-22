import {RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {UriIdModel} from "../models/UriModels";
import {Request, Response} from "express";
import {ViewCommentModel} from "../models/CommentsModels/ViewCommentModel";
import {commentsQueryRepository} from "../queryRepository/comments-query-repository";
import {UpdateCommentModel} from "../models/CommentsModels/UpdateCommentModel";
import {commentsService} from "../domain/comments-service";
import {HTTP_STATUS_CODE} from "../helpers/http-status";

export const commentsController = {

    async getCommentById(req: RequestWithParams<UriIdModel>,
                         res: Response<ViewCommentModel>) {

        const result = await commentsQueryRepository.getCommentById(req.params.id);
        result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
            : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404)
    },

    async updateComment(req: RequestWithParamsAndBody<UriIdModel, UpdateCommentModel>,
                        res: Response<void>) {

        await commentsService.updateComment(req.params.id, req.userId!.toString(), req.body.content);
        res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
    },

    async deleteComment(req: Request, res: Response<void>) {

        await commentsService.deleteOne(req.params.id);
        res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
    }
}