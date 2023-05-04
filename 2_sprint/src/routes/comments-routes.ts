import {Router, Response, Request} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {UriIdModel} from "../models/UriModels";
import {commentsQueryRepository} from "../queryRepository/comments-query-repository";
import {UpdateCommentModel} from "../models/CommentsModels/UpdateCommentModel";
import {checkToken} from "../middlewares/auth-validation-middlewares";
import {validateBodyOfComment} from "../middlewares/comments-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {commentsService} from "../domain/comments-service";
import {ViewCommentModel} from "../models/CommentsModels/ViewCommentModel";

export const commentsRoutes = Router();

commentsRoutes.get('/:id', async (req: RequestWithParams<UriIdModel>,
                                  res: Response<ViewCommentModel>) => {

    const result = await commentsQueryRepository.getCommentById(req.params.id);
    result ? res.status(200).send(result)
        : res.sendStatus(404)
})

commentsRoutes.put('/:id', checkToken, validateBodyOfComment, getErrors,
    async (req:RequestWithParamsAndBody<UriIdModel, UpdateCommentModel>, res: Response<void>) => {

    const statusCode = await commentsService.updateComment(req.params.id, req.userId!.toString(), req.body.content);
    res.sendStatus(statusCode);
})

commentsRoutes.delete('/:id', checkToken, async (req: Request, res: Response<void>) => {

    const statusCode = await commentsService.deleteOne(req.params.id, req.userId!.toString());
    res.sendStatus(statusCode);
})