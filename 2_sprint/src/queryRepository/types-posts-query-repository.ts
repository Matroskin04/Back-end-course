import {postType} from "../repositories/types-posts-repositories";

export type postPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}
