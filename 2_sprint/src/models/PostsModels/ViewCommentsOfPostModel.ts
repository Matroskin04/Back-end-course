import {CommentOutputType} from "../../repositories/repositories-types/comments-types-repositories";

export type ViewCommentOfPostModel = CommentOutputType

export type ViewAllCommentsOfPostModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<CommentOutputType>
}