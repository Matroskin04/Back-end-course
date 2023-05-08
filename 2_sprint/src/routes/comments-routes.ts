import {Router, Response, Request} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {UriIdModel} from "../models/UriModels";
import {commentsQueryRepository} from "../queryRepository/comments-query-repository";
import {UpdateCommentModel} from "../models/CommentsModels/UpdateCommentModel";
import {
    checkCommentByIdAndToken,
    validateBodyOfComment
} from "../middlewares/validation-middlewares/comments-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {commentsService} from "../domain/comments-service";
import {ViewCommentModel} from "../models/CommentsModels/ViewCommentModel";
import {checkToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";

export const commentsRoutes = Router();

commentsRoutes.get('/:id', async (req: RequestWithParams<UriIdModel>,
                                  res: Response<ViewCommentModel>) => {

    const result = await commentsQueryRepository.getCommentById(req.params.id);
    result ? res.status(200).send(result)
        : res.sendStatus(404)
})

commentsRoutes.put('/:id', checkToken, checkCommentByIdAndToken, validateBodyOfComment, getErrors,
    async (req:RequestWithParamsAndBody<UriIdModel, UpdateCommentModel>, res: Response<void>) => {

    await commentsService.updateComment(req.params.id, req.userId!.toString(), req.body.content);
    res.sendStatus(204);
})

commentsRoutes.delete('/:id', checkToken, checkCommentByIdAndToken, async (req: Request, res: Response<void>) => {

    await commentsService.deleteOne(req.params.id);
    res.sendStatus(204);
})