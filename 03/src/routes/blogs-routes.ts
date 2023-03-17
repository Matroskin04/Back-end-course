import {Router, Response} from "express";
import {allBlogs, blogsDbRepositories} from "../repositories/blogs-db-repositories";
import {authorization, checkErrorsBlog} from "../middlewares/blogs-middlewares";
import {
    errorsMessagesType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types";
import {validationResult} from "express-validator";
import {QueryBlogsModel} from "../models/BlogsModels/QueryBlogsModel";
import {ApiAllBlogsModels} from "../models/BlogsModels/ApiAllBlogsModels";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiBlogModel} from "../models/BlogsModels/ApiBlogModel";
import {UriBlogModel} from "../models/BlogsModels/UriBlogModel";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";

export const blogsRoutes = Router();
let allErrorsBlogs: {
    errorsMessages: errorsMessagesType
}

blogsRoutes.get('/', (req: RequestWithQuery<QueryBlogsModel>,
                                   res: Response<ApiAllBlogsModels>) => {

    res.status(200).send(allBlogs);
})
blogsRoutes.post('/', authorization, checkErrorsBlog, async (req: RequestWithBody<CreateBlogModel>,
                                                            res: Response<ApiAllErrorsModels | ApiBlogModel>) => {

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

        allErrorsBlogs = {
            errorsMessages: errors.array()
        };

        return res.status(400).send(allErrorsBlogs);

    } else {
        const result = await blogsDbRepositories.createBlog(req.body);

        return res.status(201).send(result);
    }
})
blogsRoutes.get('/:id', async (req: RequestWithParams<UriBlogModel>,
                               res: Response<ApiBlogModel | number>) => {

    const result = await blogsDbRepositories.getSingleBlogs(+req.params.id);

    result ? res.status(200).send(result)
        : res.send(404);
})

blogsRoutes.put('/:id', authorization, checkErrorsBlog, async (req: RequestWithParamsAndBody<UriBlogModel, UpdateBlogModel>,
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

        allErrorsBlogs = {
            errorsMessages: errors.array()
        };

        return res.status(400).send(allErrorsBlogs);

    } else {
        const result = await blogsDbRepositories.updateBlog(req.body, +req.params.id);

        result ? res.send(204)
            : res.send(404);
    }
})
blogsRoutes.delete('/:id', authorization, async (req: RequestWithParams<{ id: string }>,
                                                 res: Response<number>) => {

    const result = await blogsDbRepositories.deleteSingleBlog(+req.params.id);

    if (result) {
        return res.send(204);

    } else {
        return res.send(404);
    }
})
