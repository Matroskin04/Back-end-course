import {Router, Response} from "express";
import {blogsDbRepositories} from "../repositories/blogs-db-repositories";
import {authorization, checkErrorsBlog} from "../middlewares/blogs-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types";
import {QueryBlogsModel} from "../models/BlogsModels/QueryBlogsModel";
import {ApiAllBlogsModels} from "../models/BlogsModels/ApiAllBlogsModels";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiBlogModel} from "../models/BlogsModels/ApiBlogModel";
import {UriBlogModel} from "../models/BlogsModels/UriBlogModel";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";
import {GetErrors} from "./functions-for-routes";

export const blogsRoutes = Router();


blogsRoutes.get('/', async (req: RequestWithQuery<QueryBlogsModel>,
                            res: Response<ApiAllBlogsModels>) => {
    const result = await blogsDbRepositories.getAllBlogs()

    res.status(200).send(result);
})
blogsRoutes.post('/', authorization, checkErrorsBlog, async (req: RequestWithBody<CreateBlogModel>,
                                                            res: Response<ApiAllErrorsModels | ApiBlogModel>) => {

    const errorArray = GetErrors(req)

    if ( errorArray.length > 0 ) {

        return res.status(400).send({
            errorsMessages: errorArray
        });
    }

    const result = await blogsDbRepositories.createBlog(req.body);
    return res.status(201).send(result);
})
blogsRoutes.get('/:id', async (req: RequestWithParams<UriBlogModel>,
                               res: Response<ApiBlogModel | number>) => {

    const result = await blogsDbRepositories.getSingleBlog(req.params.id);

    result ? res.status(200).send(result)
        : res.send(404);
})

blogsRoutes.put('/:id', authorization, checkErrorsBlog, async (req: RequestWithParamsAndBody<UriBlogModel, UpdateBlogModel>,
                                                               res: Response<number | ApiAllErrorsModels>) => {

    const errorArray = GetErrors(req)

    if ( errorArray.length > 0 ) {

        return res.status(400).send({
            errorsMessages: errorArray
        });
    }

    const result = await blogsDbRepositories.updateBlog(req.body, req.params.id);

    result ? res.send(204)
            : res.send(404);
})
blogsRoutes.delete('/:id', authorization, async (req: RequestWithParams<{ id: string }>,
                                                 res: Response<number>) => {

    const result = await blogsDbRepositories.deleteSingleBlog(req.params.id);

    if (result) {
        return res.send(204);

    } else {
        return res.send(404);
    }
})
