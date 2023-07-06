import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/requests-types";
import {QueryBlogModel} from "../models/BlogsModels/QueryBlogModel";
import {Response} from "express";
import {ViewAllBlogsModel, ViewBlogModel, ViewPostsOfBlogModel} from "../models/BlogsModels/ViewBlogModel";
import {UriIdModel} from "../models/UriModels";
import {UriBlogIdModel} from "../models/BlogsModels/UriBlogModel";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {BlogsService} from "../domain/blogs-service";
import {CreatePostByBlogIdModel} from "../models/PostsModels/CreatePostModel";
import {PostTypeWithId} from "../repositories/repositories-types/posts-types-repositories";
import {UpdateBlogModel} from "../models/BlogsModels/UpdateBlogModel";
import {HTTP_STATUS_CODE} from "../helpers/http-status";
import {BlogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {PostsQueryRepository} from "../queryRepository/posts-query-repository";


export class BlogsController {

    constructor(protected blogsService: BlogsService,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository) {
    }

    async getAllBlogs(req: RequestWithQuery<QueryBlogModel>,
                      res: Response<ViewAllBlogsModel>) {

        try {
            const result = await this.blogsQueryRepository.getAllBlogs(req.query);
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async getBlogById(req: RequestWithParams<UriIdModel>,
                      res: Response<ViewBlogModel>) {

        try {
            const result = await this.blogsQueryRepository.getSingleBlog(req.params.id);
            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async getAllPostsOfBlog(req: RequestWithParamsAndQuery<UriBlogIdModel, QueryBlogModel>,
                            res: Response<ViewPostsOfBlogModel>) {

        try {
            const result = await this.postsQueryRepository.getPostsOfBlog(req.params.blogId, req.query)
            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async createBlog(req: RequestWithBody<CreateBlogModel>,
                     res: Response<ViewBlogModel>) {

        try {
            const result = await this.blogsService.createBlog(req.body);
            res.status(HTTP_STATUS_CODE.CREATED_201).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<UriBlogIdModel, CreatePostByBlogIdModel>,
                             res: Response<PostTypeWithId>) {

        try {
            const result = await this.blogsService.createPostByBlogId(req.params.blogId, req.body);
            result ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async updateBlog(req: RequestWithParamsAndBody<UriIdModel, UpdateBlogModel>,
                     res: Response<void>) {

        try {
            const result = await this.blogsService.updateBlog(req.body, req.params.id);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async deleteBlog(req: RequestWithParams<UriIdModel>, res: Response<void>) {

        try {
            const result = await this.blogsService.deleteSingleBlog(req.params.id);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}

