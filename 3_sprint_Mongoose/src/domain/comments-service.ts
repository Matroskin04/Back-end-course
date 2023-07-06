import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ObjectId} from "mongodb";
import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {PostModel} from "../db/shemasModelsMongoose/posts-shema-model";
import {mappingComment} from "../helpers/functions/comments-functions-helpers";
import {CommentDBType} from "../types/db-types";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersQueryRepository} from "../queryRepository/users-query-repository";


export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository,
                protected usersQueryRepository: UsersQueryRepository) {}

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await  this.commentsRepository.updateComment(id, idFromToken, content);
        return;
    }

    async deleteOne(id: string): Promise<void> {

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
            postId
        )

        await  this.commentsRepository.createCommentByPostId(comment);
        return mappingComment(comment);
    }
}

