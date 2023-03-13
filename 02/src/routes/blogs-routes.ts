import {Router, Request, Response} from "express";
import {allBlogs, blogsRepositories} from "../repositories/blogs-repositories";
import {authorization, checkErrorsBlog} from "../middlewares/blogs-middlewares";
import {validationResult} from "express-validator";
import {errorsMessagesType} from "../types";

export const blogsRoutes = Router();
let allErrors: {
    errorsMessages: errorsMessagesType
}

blogsRoutes.get('/', (req: Request, res: Response) => {

    res.status(200).send(allBlogs);
})
blogsRoutes.post('/', authorization, checkErrorsBlog, (req: Request, res: Response) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    allErrors = {
        errorsMessages: errors.array()
    };

    if (!errors.isEmpty()) {
        return res.status(400).send(allErrors);

    } else {
        const result = blogsRepositories.createBlog(req.body);
        return res.status(201).send(result);
    }
})
blogsRoutes.get('/:id', (req: Request, res: Response) => {

    const result = blogsRepositories.getSingleBlogs(+req.params.id);

    result ? res.status(200).send(result)
           : res.send(404);
})

blogsRoutes.put('/:id', authorization, checkErrorsBlog, (req: Request, res: Response) => {

    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    allErrors = {
        errorsMessages: errors.array()
    };

    if (!errors.isEmpty()) {
        return res.status(400).send(allErrors);

    } else {
        const result = blogsRepositories.updateBlog(req.body, +req.params.id);
        result ? res.send(204)
                : res.send(404);
    }
})
blogsRoutes.delete('/:id', authorization, (req: Request, res: Response) => {

    const result = blogsRepositories.deleteSingleBlog(+req.params.id);

    if ( result ) {
        return res.send(204);

    } else {
        return res.send(404);
    }
})
