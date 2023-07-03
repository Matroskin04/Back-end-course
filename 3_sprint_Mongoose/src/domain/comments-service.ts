import {commentsRepository} from "../repositories/comments-repository";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ObjectId} from "mongodb";
import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {PostModel} from "../db/shemasModelsMongoose/posts-shema-model";
import {mappingComment} from "../helpers/functions/comments-functions-helpers";
import {CommentDBType} from "../types/db-types";

export const commentsService = {

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await commentsRepository.updateComment(id, idFromToken, content);
        return;
    },

    async deleteOne(id: string): Promise<void> {

        await commentsRepository.deleteComment(id);
        return;
    },

    async createCommentByPostId(body: CreateCommentByPostIdModel, userId: ObjectId, postId: string): Promise<null | CommentOutputType> {

        const user = await usersQueryRepository.getUserByUserId(userId)
        if (!user) {
            return null;
        }

        const post = await PostModel.findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null;
        }

        const comment: CommentDBType = {
            _id: new ObjectId(),
            content: body.content,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }

        await commentsRepository.createCommentByPostId(comment);
        return mappingComment(comment);
    }
}