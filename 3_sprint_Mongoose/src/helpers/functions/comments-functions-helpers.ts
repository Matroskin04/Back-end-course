import {CommentOutputType} from "../../repositories/repositories-types/comments-types-repositories";

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