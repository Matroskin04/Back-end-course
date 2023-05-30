import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {commentsRepository} from "../repositories/comments-repository";

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

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await commentsRepository.updateComment(id, idFromToken, content);
        return;
    },

    async deleteOne(id: string): Promise<void> {

        await commentsRepository.deleteComment(id);
        return;
    }
}