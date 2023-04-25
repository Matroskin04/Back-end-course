import {postType} from "../../repositories/types-posts-repositories";

export type ParamsBlogModel = {
    id: string
}

export type ParamsBlogIdModel = {
    blogId: string
}

export type QueryBlogsModel = {  
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: string
    pageNumber?: string | number
    pageSize?: string | number
}


export type QueryPostsOfBlogModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}