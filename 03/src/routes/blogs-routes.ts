import {Router, Response} from "express";
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
import {blogsService} from "../domain/blogs-service";

export const blogsRoutes = Router();


blogsRoutes.get('/', async (req: RequestWithQuery<QueryBlogsModel>,
                            res: Response<ApiAllBlogsModels>) => {

    const result = await blogsService.getAllBlogs()
    res.status(200).send(result);
})
blogsRoutes.post('/', authorization, checkErrorsBlog, getErrors, async (req: RequestWithBody<CreateBlogModel>,
                                                            res: Response<ApiAllErrorsModels | ApiBlogModel>) => {


    const result = await blogsService.createBlog(req.body);
    res.status(201).send(result);
})
blogsRoutes.get('/:id', async (req: RequestWithParams<UriBlogModel>,
                               res: Response<ApiBlogModel | number>) => {

    const result = await blogsService.getSingleBlog(req.params.id);

    result ? res.status(200).send(result)
        : res.send(404);
})

blogsRoutes.put('/:id', authorization, checkErrorsBlog, getErrors,  async (req: RequestWithParamsAndBody<UriBlogModel, UpdateBlogModel>,
                                                               res: Response<number | ApiAllErrorsModels>) => {


    const result = await blogsService.updateBlog(req.body, req.params.id);

    result ? res.send(204)
            : res.send(404);
})
blogsRoutes.delete('/:id', authorization, async (req: RequestWithParams<{ id: string }>,
                                                 res: Response<number>) => {

    const result = await blogsService.deleteSingleBlog(req.params.id);

    if (result) {
        return res.send(204);

    } else {
        return res.send(404);
    }
})
