import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {QueryPostModel} from "../models/PostsModels/QueryPostModel";
import {Response} from "express";
import {ViewAllPostsModel, ViewPostModel} from "../models/PostsModels/ViewPostModel";
import {postsQueryRepository} from "../queryRepository/posts-query-repository";
import {UriIdModel} from "../models/UriModels";
import {ViewAllCommentsOfPostModel, ViewCommentOfPostModel} from "../models/PostsModels/ViewCommentsOfPostModel";
import {commentsQueryRepository} from "../queryRepository/comments-query-repository";
import {CreatePostModel} from "../models/PostsModels/CreatePostModel";
import {postsService} from "../domain/posts-service";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {UpdatePostModel} from "../models/PostsModels/UpdatePostModel";
import {HTTP_STATUS_CODE} from "../helpers/http-status";

export const postsController = {

    async getAllPosts(req: RequestWithQuery<QueryPostModel>,
                      res: Response<ViewAllPostsModel>) {

        const result = await postsQueryRepository.getAllPosts(req.query);
        res.status(HTTP_STATUS_CODE.OK_200).send(result);
    },

    async getPostById(req: RequestWithParams<UriIdModel>,
                      res: Response<ViewPostModel>) {

        const result = await postsQueryRepository.getSinglePost(req.params.id)

        result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
            : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404)
    },

    async getAllCommentsOfPost(req: RequestWithParamsAndQuery<UriIdModel, QueryPostModel>,
                               res: Response<ViewAllCommentsOfPostModel>) {

        const result = await commentsQueryRepository.getCommentsOfPost(req.query, req.params.id);
        result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
            : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404)
    },

    async createPost(req: RequestWithBody<CreatePostModel>,
                     res: Response<ViewPostModel>) {

        const result = await postsService.createPost(req.body)
        res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
    },

    async createCommentByPostId(req: RequestWithParamsAndBody<UriIdModel, CreateCommentByPostIdModel>,
                                res: Response<ViewCommentOfPostModel>) {

        const result = await postsService.createCommentByPostId(req.body, req.userId!, req.params.id);
        result ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
            : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404)
    },

    async updatePost(req: RequestWithParamsAndBody<UriIdModel, UpdatePostModel>,
                     res: Response<void>) {

        const result = await postsService.updatePost(req.body, req.params.id);
        result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
            : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    },

    async deletePost(req: RequestWithParams<UriIdModel>,
                     res: Response<void>) {

        const result = await postsService.deleteSinglePost(req.params.id);
        result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
            : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    }
}