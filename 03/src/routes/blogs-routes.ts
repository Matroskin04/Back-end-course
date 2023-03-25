import {Router, Response} from "express";
import {authorization, checkErrorsBlog} from "../middlewares/blogs-middlewares";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {ApiBlogModel, ApiAllBlogsModels} from "../models/BlogsModels/ApiBlogModel";
import {
    ParamsBlogIdModel,
    ParamsBlogModel,
    QueryBlogsModel,
    QueryPostsOfBlogModel
} from "../models/BlogsModels/UriBlogModel";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";
import {getErrors} from "../middlewares/validation-middlewares";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {postType} from "../repositories/types-posts-repositories";
import {CreatePostByBlogIdModel} from "../models/PostsModels/CreatePostModel";
import {checkErrorsPostByBlogId} from "../middlewares/posts-middlewares";

export const blogsRoutes = Router();


blogsRoutes.get('/', async (req: RequestWithQuery<QueryBlogsModel>,
                            res: Response<ApiAllBlogsModels>) => {
    const result = await blogsQueryRepository.getAllBlogs(req.query)
    res.status(200).send(result);
})

blogsRoutes.get('/:id', async (req: RequestWithParams<ParamsBlogModel>,
                               res: Response<ApiBlogModel | number>) => {

    const result = await blogsQueryRepository.getSingleBlog(req.params.id);
    console.log(result)
    result ? res.status(200).send(result)
        : res.send(404);
})

blogsRoutes.get('/:blogId/posts', async (req: RequestWithParamsAndQuery<ParamsBlogIdModel, QueryBlogsModel>,
                                         res: Response<QueryPostsOfBlogModel | number>) => {

    const result = await blogsQueryRepository.getPostsOfBlog(req.params.blogId, req.query)
    result ? res.status(200).send(result)
        : res.send(404);
})

blogsRoutes.post('/', authorization, checkErrorsBlog, getErrors, async (req: RequestWithBody<CreateBlogModel>,
                                                                        res: Response<ApiAllErrorsModels | ApiBlogModel>) => {


    const result = await blogsService.createBlog(req.body);
    res.status(201).send(result);
})

blogsRoutes.post('/:blogId/posts', authorization, checkErrorsPostByBlogId, getErrors,
    async (req: RequestWithParamsAndBody<ParamsBlogIdModel, CreatePostByBlogIdModel>,
           res: Response<ApiAllErrorsModels | postType | number>) => {

    const result = await blogsService.createPostByBlogId(req.params.blogId, req.body);
    result ? res.status(201).send(result)
        : res.send(404);
})

blogsRoutes.put('/:id', authorization, checkErrorsBlog, getErrors,
    async (req: RequestWithParamsAndBody<ParamsBlogModel, UpdateBlogModel>,
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
