import {PostType} from "../../repositories/repositories-types/posts-types-repositories";

export type ViewPostModel = PostType;

export type ViewAllPostsModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostType>
}
