import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {QueryBlogModel} from "../models/BlogsModels/QueryBlogModel";
import {Response} from "express";
import {ViewAllBlogsModel, ViewBlogModel, ViewPostsOfBlogModel} from "../models/BlogsModels/ViewBlogModel";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {UriIdModel} from "../models/UriModels";
import {UriBlogIdModel} from "../models/BlogsModels/UriBlogModel";
import {postsQueryRepository} from "../queryRepository/posts-query-repository";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {blogsService} from "../domain/blogs-service";
import {CreatePostByBlogIdModel} from "../models/PostsModels/CreatePostModel";
import {PostTypeWithId} from "../repositories/repositories-types/posts-types-repositories";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";

export const blogsController = {

    async getAllBlogs(req: RequestWithQuery<QueryBlogModel>,
                      res: Response<ViewAllBlogsModel>) {

        const result = await blogsQueryRepository.getAllBlogs(req.query);
        res.status(200).send(result);
    },

    async getBlogById(req: RequestWithParams<UriIdModel>,
                      res: Response<ViewBlogModel>) {

        const result = await blogsQueryRepository.getSingleBlog(req.params.id);
        result ? res.status(200).send(result)
            : res.sendStatus(404);
    },

    async getAllPostsOfBlog(req: RequestWithParamsAndQuery<UriBlogIdModel, QueryBlogModel>,
           res: Response<ViewPostsOfBlogModel>) {

    const result = await postsQueryRepository.getPostsOfBlog(req.params.blogId, req.query)
    result ? res.status(200).send(result)
        : res.sendStatus(404);
},

    async createBlog(req: RequestWithBody<CreateBlogModel>,
           res: Response<ViewBlogModel>) {

    const result = await blogsService.createBlog(req.body);
    res.status(201).send(result);
},

    async createPostByBlogId(req: RequestWithParamsAndBody<UriBlogIdModel, CreatePostByBlogIdModel>,
           res: Response<PostTypeWithId>) {

    const result = await blogsService.createPostByBlogId(req.params.blogId, req.body);
    result ? res.status(201).send(result)
        : res.sendStatus(404);
},

    async updateBlog(req: RequestWithParamsAndBody<UriIdModel, UpdateBlogModel>,
           res: Response<void>) {

    const result = await blogsService.updateBlog(req.body, req.params.id);

    result ? res.sendStatus(204)
        : res.sendStatus(404);
},

    async deleteBlog(req: RequestWithParams<UriIdModel>,
           res: Response<void>) {

    const result = await blogsService.deleteSingleBlog(req.params.id);
    if (result) {
        return res.sendStatus(204);

    } else {
        return res.sendStatus(404);
    }
}
}