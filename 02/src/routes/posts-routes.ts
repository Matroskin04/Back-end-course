import {Router, Request, Response} from "express";
import {postsRepositories} from "../repositories/posts-repositories";
import {authorization} from "../middlewares/blogs-middlewares";
import {checkErrorsPost} from "../middlewares/posts-middlewares";
import {validationResult} from "express-validator";
import {errorsMessagesType} from "../types";

export const postsRoutes = Router();
let allErrorsPost: {
    errorsMessages: errorsMessagesType
};
postsRoutes.get('/', (req: Request, res: Response) => {

    const result = postsRepositories.getAllPosts()
    res.status(200).send(result)
});
postsRoutes.post('/', authorization, checkErrorsPost, (req: Request, res: Response) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    allErrorsPost = {
        errorsMessages: errors.array()
    };

    if (!errors.isEmpty()) {
        return res.status(400).send(allErrorsPost);

    } else {
        const result = postsRepositories.createPost(req.body)
        res.status(201).send(result)
    }

});
postsRoutes.get('/:id', (req: Request, res: Response) => {

    const result = postsRepositories.getSinglePost(+req.params.id)
    result ? res.status(200).send(result)
           : res.send(404)
});
postsRoutes.put('/:id', authorization, checkErrorsPost, (req: Request, res: Response) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    allErrorsPost = {
        errorsMessages: errors.array()
    };

    if (!errors.isEmpty()) {
        return res.status(400).send(allErrorsPost);

    } else {
        const result = postsRepositories.updatePost(req.body, +req.params.id);
        result ? res.send(204)
               : res.send(404);
    }

});
postsRoutes.delete('/:id', authorization, (req: Request, res: Response) => {

    const result = postsRepositories.deleteSinglePost(+req.params.id);
    result ? res.send(204)
           : res.send(404);
});



