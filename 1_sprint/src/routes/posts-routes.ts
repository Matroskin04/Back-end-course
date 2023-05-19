import {Router, Response} from "express";
import {authorization} from "../middlewares/blogs-middlewares";
import {checkErrorsPost} from "../middlewares/posts-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types";
import {CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiPostModel, ApiAllPostsModel} from "../models/PostsModels/ApiPostModel";
import {UriPostModel,QueryPostsModel} from "../models/PostsModels/UriPostModel";
import {UpdatePostModel} from "../models/PostsModels/UpdatePostModel";
import {getErrors} from "../middlewares/validation-middlewares";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../queryRepository/posts-query-repository";

export const postsRoutes = Router();


postsRoutes.get('/', async (req: RequestWithQuery<QueryPostsModel>,
                            res: Response<ApiAllPostsModel>) => {

    const result = await postsQueryRepository.getAllPosts(req.query);
    res.status(200).send(result);
});
postsRoutes.post('/', authorization, checkErrorsPost, getErrors,
    async (req: RequestWithBody<CreatePostModel>,
           res: Response<ApiPostModel | ApiAllErrorsModels>) => {

        const result = await postsService.createPost(req.body)
        res.status(201).send(result)

});
postsRoutes.get('/:id', async (req: RequestWithParams<UriPostModel>,
                                            res: Response<number | ApiPostModel>) => {

    const result = await postsQueryRepository.getSinglePost(req.params.id)

    result ? res.status(200).send(result)
        : res.sendStatus(404)
});
postsRoutes.put('/:id', authorization, checkErrorsPost, getErrors,
    async (req: RequestWithParamsAndBody<UriPostModel, UpdatePostModel>,
           res: Response<number | ApiAllErrorsModels>) => {

        const result = await postsService.updatePost(req.body, req.params.id);
        result ? res.sendStatus(204)
            : res.sendStatus(404);
});
postsRoutes.delete('/:id', authorization, async (req: RequestWithParams<UriPostModel>,
                                                 res: Response<number>) => {

    const result = await postsService.deleteSinglePost(req.params.id);
    result ? res.sendStatus(204)
        : res.sendStatus(404);
});



