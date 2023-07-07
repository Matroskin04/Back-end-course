import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ObjectId} from "mongodb";
import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {PostModel} from "../db/shemasModelsMongoose/posts-schema-model";
import {mappingComment} from "../helpers/functions/comments-functions-helpers";
import {CommentDBType} from "../types/db-types";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersQueryRepository} from "../queryRepository/users-query-repository";
import {LikeStatus} from "../helpers/enums/like-status";
import {CommentsQueryRepository} from "../queryRepository/comments-query-repository";


export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository,
                protected usersQueryRepository: UsersQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository) {}

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await  this.commentsRepository.updateComment(id, idFromToken, content);
        return;
    }

    async deleteComment(id: string): Promise<void> {

        await  this.commentsRepository.deleteComment(id);
        return;
    }

    async createCommentByPostId(body: CreateCommentByPostIdModel, userId: ObjectId, postId: string): Promise<null | CommentOutputType> {

        const user = await this.usersQueryRepository.getUserByUserId(userId)
        if (!user) {
            return null;
        }

        const post = await PostModel.findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null;
        }

        const comment = new CommentDBType(
            new ObjectId(),
            body.content,
            {
                userId: userId.toString(),
                userLogin: user.login
            },
            new Date().toISOString(),
            postId,
            {
                likesCount: 0,
                dislikesCount: 0
            }
        )

        await  this.commentsRepository.createCommentByPostId(comment);
        return mappingComment(comment);
    }

    async updateLikeStatusOfComment(commentId: string, likeStatus: LikeStatus): Promise<boolean> {

        const comment = this.commentsQueryRepository.getCommentById(commentId);
        if (!comment) {
            return false;
        }

        const result = this.commentsRepository.updateLikeStatusOfComment(commentId, likeStatus);
        if (!result) {
            throw new Error('Updating like status failed');
        }

        return true;
    }
}

