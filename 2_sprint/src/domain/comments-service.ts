import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {commentsRepositories} from "../repositories/comments-repositories";
import {ObjectId} from "mongodb";
import {commentsCollection} from "../db";

export function mappingComment(comment: any
): CommentOutputType {
    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
    }
}
export const commentsService = {

    async updateComment(id: string, idFromToken: string, content: string): Promise<number> {

        const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return 404
        }
        if (comment.commentatorInfo.userId !== idFromToken) {
            return 403;
        }

        await commentsRepositories.updateComment(id, idFromToken, content);
        return 204;
    },

    async deleteOne(id: string, idFromToken: string): Promise<number> {

        const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return 404
        }
        if (comment.commentatorInfo.userId !== idFromToken) {
            return 403;
        }

        await commentsRepositories.deleteComment(id);
        return 204;
    }
}