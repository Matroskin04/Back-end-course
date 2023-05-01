import {PostTypeWithId} from "../../repositories/repositories-types/posts-types-repositories";
import {CommentOutputType} from "../../repositories/repositories-types/comments-types-repositories";

export type PostPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostTypeWithId>
}

export type CommentOfPostPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<CommentOutputType>
}