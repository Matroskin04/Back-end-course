import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../types/requests-types";
import {QueryPostModel} from "../../models/PostsModels/QueryPostModel";
import {Response} from "express";
import {ViewAllPostsModel, ViewPostModel} from "../../models/PostsModels/ViewPostModel";
import {PostsQueryRepository} from "../../infrastructure/queryRepository/posts-query-repository";
import {UriIdModel} from "../../models/UriModels";
import {ViewAllCommentsOfPostModel, ViewCommentOfPostModel} from "../../models/PostsModels/ViewCommentsOfPostModel";
import {CreatePostModel} from "../../models/PostsModels/CreatePostModel";
import {PostsService} from "../../application/services/posts-service";
import {CreateCommentByPostIdModel} from "../../models/CommentsModels/CreateCommentModel";
import {UpdatePostModel} from "../../models/PostsModels/UpdatePostModel";
import {HTTP_STATUS_CODE} from "../../helpers/enums/http-status";
import {ViewAllErrorsModels} from "../../models/ViewAllErrorsModels";
import {CommentsQueryRepository} from "../../infrastructure/queryRepository/comments-query-repository";
import {CommentsService} from "../../application/services/comments-service";
import { injectable } from "inversify";
import {UpdateLikeStatusModel} from "../../models/CommentsModels/UpdateCommentLikeStatus";


@injectable()
export class PostsController {

    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService,
                protected commentsQueryRepository: CommentsQueryRepository,
                protected commentsService: CommentsService) {
    }

    async getAllPosts(req: RequestWithQuery<QueryPostModel>,
                      res: Response<ViewAllPostsModel>) {

        try {
            const result = await this.postsQueryRepository.getAllPosts(req.query);
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async getPostById(req: RequestWithParams<UriIdModel>,
                      res: Response<ViewPostModel>) {

        try {
            const result = await this.postsQueryRepository.getPostById(req.params.id, req.userId)

            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async getAllCommentsOfPost(req: RequestWithParamsAndQuery<UriIdModel, QueryPostModel>,
                               res: Response<ViewAllCommentsOfPostModel>) {

        try {
            const result = await this.commentsQueryRepository.getCommentsOfPost(req.query, req.params.id, req.userId);
            result ? res.status(HTTP_STATUS_CODE.OK_200).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async createPost(req: RequestWithBody<CreatePostModel>,
                     res: Response<ViewPostModel | ViewAllErrorsModels>) {

        try {
            const result = await this.postsService.createPost(req.body);

            result.status === 201 ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result.message) :
                res.status(result.status).json(result.message);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async createCommentByPostId(req: RequestWithParamsAndBody<UriIdModel, CreateCommentByPostIdModel>,
                                res: Response<ViewCommentOfPostModel>) {

        try {
            const result = await this.commentsService.createCommentByPostId(req.body, req.userId!, req.params.id);

            result ? res.status(HTTP_STATUS_CODE.CREATED_201).send(result)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async updatePost(req: RequestWithParamsAndBody<UriIdModel, UpdatePostModel>,
                     res: Response<string | ViewAllErrorsModels>) {

        try {
            const result = await this.postsService.updatePost(req.body, req.params.id);

            result.status === 204 ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.status(result.status).send(result.message);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async updateLikeStatusOfPost(req: RequestWithParamsAndBody<UriIdModel, UpdateLikeStatusModel>, res: Response<string>) {

        try {
            const result = await this.postsService.updateLikeStatusOfPost(req.params.id, req.userId!, req.body.likeStatus);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.status(HTTP_STATUS_CODE.NOT_FOUND_404).send('Post with specified id doesn\'t exist');

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async deletePost(req: RequestWithParams<UriIdModel>,
                     res: Response<void>) {

        try {
            const result = await this.postsService.deleteSinglePost(req.params.id);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}

