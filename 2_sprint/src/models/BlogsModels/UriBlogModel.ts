import {postType} from "../../repositories/types-posts-repositories";

export type ParamsBlogIdModel = {
    blogId: string
}


export type ApiPostsOfBlogModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}