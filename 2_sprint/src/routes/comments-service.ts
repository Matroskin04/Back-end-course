import {Router, Response, Request} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {paramsModels} from "../models/UriModels";
import {ApiCommentModel} from "../models/CommentsModels/ApiCommentModel";
import {commentsQueryRepository} from "../queryRepository/comments-query-repository";
import {UpdateCommentModel} from "../models/CommentsModels/UpdateCommentModel";
import {checkToken} from "../middlewares/auth-middlewares";
import {validateBodyOfComment} from "../middlewares/comments-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {commentsService} from "../domain/comments-service";

export const commentsRoutes = Router();

commentsRoutes.get('/:id', async (req: RequestWithParams<paramsModels>, res: Response<ApiCommentModel>) => {

    const result = await commentsQueryRepository.getCommentById(req.params.id);
    result ? res.status(200).send(result)
        : res.sendStatus(404)
})

commentsRoutes.put('/:id', checkToken, validateBodyOfComment, getErrors,
    async (req:RequestWithParamsAndBody<paramsModels, UpdateCommentModel>, res: Response<ApiAllErrorsModels | void>) => {

    const statusCode = await commentsService.updateComment(req.params.id, req.userId!.toString(), req.body.content);
    res.sendStatus(statusCode);
})

commentsRoutes.delete('/:id', checkToken, async (req: Request, res: Response<void>) => {

    const statusCode = await commentsService.deleteOne(req.params.id, req.userId!.toString());
    res.sendStatus(statusCode);
})