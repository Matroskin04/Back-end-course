import {CommentViewType} from "../../infrastructure/repositories/repositories-types/comments-types-repositories";

export type ViewCommentOfPostModel = CommentViewType

export type ViewAllCommentsOfPostModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<CommentViewType>
}