import {Router, Response} from "express";
import {postsRepositories} from "../repositories/posts-repositories";
import {authorization} from "../middlewares/blogs-middlewares";
import {checkErrorsPost} from "../middlewares/posts-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types";
import {QueryAllPostsModel} from "../models/PostsModels/QueryAllPostsModel";
import {ApiAllPostsModel} from "../models/PostsModels/ApiAllPostsModel";
import {CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiPostModel} from "../models/PostsModels/ApiPostModel";
import {UriPostModel} from "../models/PostsModels/UriPostModel";
import {UpdatePostModel} from "../models/PostsModels/UpdatePostModel";
import {GetErrors} from "./functions-for-routes";

export const postsRoutes = Router();


postsRoutes.get('/', async (req: RequestWithQuery<QueryAllPostsModel>,
                            res: Response<ApiAllPostsModel>) => {
    const result = await postsRepositories.getAllPosts();

    res.status(200).send(result);
});
postsRoutes.post('/', authorization, checkErrorsPost, async (req: RequestWithBody<CreatePostModel>,
                                                             res: Response<ApiPostModel | ApiAllErrorsModels>) => {

    const errorArray = GetErrors(req)

    if ( errorArray.length > 0 ) {

        return res.status(400).send({
            errorsMessages: errorArray
        });
    }
        const result = await postsRepositories.createPost(req.body)
        res.status(201).send(result)

});
postsRoutes.get('/:id', async (req: RequestWithParams<UriPostModel>,
                                            res: Response<number | ApiPostModel>) => {

    const result = await postsRepositories.getSinglePost(req.params.id)

    result ? res.status(200).send(result)
        : res.send(404)
});
postsRoutes.put('/:id', authorization, checkErrorsPost, async (req: RequestWithParamsAndBody<UriPostModel, UpdatePostModel>,
                                                               res: Response<number | ApiAllErrorsModels>) => {

    const errorArray = GetErrors(req);

    if ( errorArray.length > 0 ) {

        return res.status(400).send({
            errorsMessages: errorArray
        });
    }

        const result = await postsRepositories.updatePost(req.body, req.params.id);
        result ? res.send(204)
            : res.send(404);
});
postsRoutes.delete('/:id', authorization, async (req: RequestWithParams<UriPostModel>,
                                                 res: Response<number>) => {

    const result = await postsRepositories.deleteSinglePost(req.params.id);
    result ? res.send(204)
        : res.send(404);
});



