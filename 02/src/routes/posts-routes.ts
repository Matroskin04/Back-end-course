import {Router, Response} from "express";
import {allPosts, postsRepositories} from "../repositories/posts-repositories";
import {authorization} from "../middlewares/blogs-middlewares";
import {checkErrorsPost} from "../middlewares/posts-middlewares";
import {validationResult} from "express-validator";
import {
    errorsMessagesType,
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

export const postsRoutes = Router();
let allErrorsPost: {
    errorsMessages: errorsMessagesType
};

postsRoutes.get('/', (req: RequestWithQuery<QueryAllPostsModel>,
                                   res: Response<ApiAllPostsModel>) => {

    res.status(200).send(allPosts)
});
postsRoutes.post('/', authorization, checkErrorsPost, (req: RequestWithBody<CreatePostModel>,
                                                            res: Response<ApiPostModel | ApiAllErrorsModels>) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {

        allErrorsPost = {
            errorsMessages: errors.array()
        };

        return res.status(400).send(allErrorsPost);

    } else {
        const result = postsRepositories.createPost(req.body)
        res.status(201).send(result)
    }

});
postsRoutes.get('/:id', (req: RequestWithParams<UriPostModel>,
                                      res: Response<number | ApiPostModel>) => {

    const result = allPosts.find(p => +p.id === +req.params.id)

    result ? res.status(200).send(result)
           : res.send(404)
});
postsRoutes.put('/:id', authorization, checkErrorsPost, (req: RequestWithParamsAndBody<UriPostModel, UpdatePostModel>,
                                                              res: Response<number | ApiAllErrorsModels>) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {

        allErrorsPost = {
            errorsMessages: errors.array()
        };

        return res.status(400).send(allErrorsPost);

    } else {
        const result = postsRepositories.updatePost(req.body, +req.params.id);
        result ? res.send(204)
               : res.send(404);
    }

});
postsRoutes.delete('/:id', authorization, (req: RequestWithParams<UriPostModel>,
                                                res: Response<number>) => {

    const result = postsRepositories.deleteSinglePost(+req.params.id);
    result ? res.send(204)
           : res.send(404);
});



