import {blogType} from "../../repositories/types-blogs-repositories";

export type ApiBlogModel = blogType

export type ApiAllBlogsModels = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<blogType>
}

