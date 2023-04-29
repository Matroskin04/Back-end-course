import {blogType} from "../repositories/types-blogs-repositories";
import {postType} from "../repositories/types-posts-repositories";

export type blogPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<blogType>
}

export type postsOfBlogPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}

export type variablesForReturnType = {
    pageNumber: string | number
    pageSize: string | number
    sortBy: string
    sortDirection: number
    paramSort: any
}
