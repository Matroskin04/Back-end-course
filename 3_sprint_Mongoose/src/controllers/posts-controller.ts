import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/requests-types";
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
import {commentsService} from "../domain/comments-service";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";

export const postsController = {

    async getAllPosts(req: RequestWithQuery<QueryPostModel>,
                      res: Response<ViewAllPostsModel>) {

        try {
            const result = await postsQueryRepository.getAllPosts(req.query);
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }    },

    async getPostById(req: RequestWithParams<UriIdModel>,
                      res: Response<ViewPostModel>) {

        try {
            const result = await postsQueryRepository.getSinglePost(req.params.id)

            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async getAllCommentsOfPost(req: RequestWithParamsAndQuery<UriIdModel, QueryPostModel>,
                               res: Response<ViewAllCommentsOfPostModel>) {

        try {
            const result = await commentsQueryRepository.getCommentsOfPost(req.query, req.params.id);
            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async createPost(req: RequestWithBody<CreatePostModel>,
                     res: Response<ViewPostModel | ViewAllErrorsModels>) {

        try {
            const result = await postsService.createPost(req.body);

            result.status === 201 ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result.message) :
                res.status(result.status).json(result.message);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async createCommentByPostId(req: RequestWithParamsAndBody<UriIdModel, CreateCommentByPostIdModel>,
                                res: Response<ViewCommentOfPostModel>) {

        try {
            const result = await commentsService.createCommentByPostId(req.body, req.userId!, req.params.id);

            result ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async updatePost(req: RequestWithParamsAndBody<UriIdModel, UpdatePostModel>,
                     res: Response<string | ViewAllErrorsModels>) {

        try {
            const result = await postsService.updatePost(req.body, req.params.id);

            result.status === 204 ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.status(result.status).send(result.message);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async deletePost(req: RequestWithParams<UriIdModel>,
                     res: Response<void>) {

        try {
            const result = await postsService.deleteSinglePost(req.params.id);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}