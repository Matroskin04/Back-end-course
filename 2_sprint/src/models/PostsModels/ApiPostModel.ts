import {postType} from "../../repositories/types-posts-repositories";

export type ApiPostModel = postType;
export type ApiAllPostsModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<postType>
}
