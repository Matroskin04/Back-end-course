import {postType} from "../repositories/types-posts-repositories";
import {commentOutputType} from "../repositories/types-comments-repositories";

export type postPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}

export type commentOfPostPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<commentOutputType>
}