import {Router, Response} from "express";
import {blogsDbRepositories} from "../repositories/blogs-db-repositories";
import {authorization, checkErrorsBlog} from "../middlewares/blogs-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiBlogModel, ApiAllBlogsModels} from "../models/BlogsModels/ApiBlogModel";
import {UriBlogModel, QueryBlogsModel} from "../models/BlogsModels/UriBlogModel";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";
import {getErrors} from "../middlewares/validation-middlewares";

export const blogsRoutes = Router();


blogsRoutes.get('/', async (req: RequestWithQuery<QueryBlogsModel>,
                            res: Response<ApiAllBlogsModels>) => {
    const result = await blogsDbRepositories.getAllBlogs()

    res.status(200).send(result);
})
blogsRoutes.post('/', authorization, checkErrorsBlog, getErrors, async (req: RequestWithBody<CreateBlogModel>,
                                                            res: Response<ApiAllErrorsModels | ApiBlogModel>) => {


    const result = await blogsDbRepositories.createBlog(req.body);
    return res.status(201).send(result);
})
blogsRoutes.get('/:id', async (req: RequestWithParams<UriBlogModel>,
                               res: Response<ApiBlogModel | number>) => {

    const result = await blogsDbRepositories.getSingleBlog(req.params.id);

    result ? res.status(200).send(result)
        : res.send(404);
})

blogsRoutes.put('/:id', authorization, checkErrorsBlog, getErrors,  async (req: RequestWithParamsAndBody<UriBlogModel, UpdateBlogModel>,
                                                               res: Response<number | ApiAllErrorsModels>) => {


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
