import {postType} from "../../repositories/types-posts-repositories";
import {commentOutputType} from "../../repositories/types-comments-repositories";

export type ApiPostModel = postType;
export type ApiAllPostsModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}

export type ApiCommentsOfPostModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<commentOutputType>
}