import {Router, Response} from "express";
import {authorization} from "../middlewares/authorization-middelwares";
import {validateBodyOfPost} from "../middlewares/posts-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiPostModel, ApiAllPostsModel, ApiCommentsOfPostModel} from "../models/PostsModels/ApiPostModel";
import {UpdatePostModel} from "../models/PostsModels/UpdatePostModel";
import {getErrors} from "../middlewares/validation-middlewares";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../queryRepository/posts-query-repository";
import {paramsModels, QueryModel} from "../models/UriModels";
import {checkToken} from "../middlewares/auth-middlewares";
import {validateBodyOfComment} from "../middlewares/comments-middlewares";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ApiCommentModel} from "../models/CommentsModels/ApiCommentModel";

export const postsRoutes = Router();


postsRoutes.get('/', async (req: RequestWithQuery<QueryModel>,
                            res: Response<ApiAllPostsModel>) => {

    const result = await postsQueryRepository.getAllPosts(req.query);
    res.status(200).send(result);
});
postsRoutes.get('/:id', async (req: RequestWithParams<paramsModels>,
                               res: Response<number | ApiPostModel>) => {

    const result = await postsQueryRepository.getSinglePost(req.params.id)

    result ? res.status(200).send(result)
        : res.sendStatus(404)
});
postsRoutes.get('/:id/comments', async (req:RequestWithParamsAndQuery<paramsModels, QueryModel>,
                                        res: Response<ApiCommentsOfPostModel>) => {

    const result = await postsQueryRepository.getCommentOfPost(req.query, req.params.id);
    result ? res.status(200).send(result)
        : res.sendStatus(404)
})
postsRoutes.post('/', authorization, validateBodyOfPost, getErrors,
    async (req: RequestWithBody<CreatePostModel>,
           res: Response<ApiPostModel | ApiAllErrorsModels>) => {

        const result = await postsService.createPost(req.body)
        res.status(201).send(result)

});
postsRoutes.post('/:id/comments', checkToken, validateBodyOfComment, getErrors,
    async (req: RequestWithParamsAndBody<paramsModels, CreateCommentByPostIdModel>,
           res: Response<ApiCommentModel | ApiAllErrorsModels>) => {

    const result = await postsService.createCommentByPostId(req.body, req.userId!, req.params.id);
    result ? res.status(201).send(result)
        : res.sendStatus(404)
});
postsRoutes.put('/:id', authorization, validateBodyOfPost, getErrors,
    async (req: RequestWithParamsAndBody<paramsModels, UpdatePostModel>,
           res: Response<number | ApiAllErrorsModels>) => {

        const result = await postsService.updatePost(req.body, req.params.id);
        result ? res.sendStatus(204)
            : res.sendStatus(404);
});
postsRoutes.delete('/:id', authorization, async (req: RequestWithParams<paramsModels>,
                                                 res: Response<number>) => {

    const result = await postsService.deleteSinglePost(req.params.id);
    result ? res.sendStatus(204)
        : res.sendStatus(404);
});



