import {BlogTypeWithId} from "../../repositories/repositories-types/blogs-types-repositories";
import {PostTypeWithId} from "../../repositories/repositories-types/posts-types-repositories";

export type BlogPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<BlogTypeWithId>
}

export type PostsOfBlogPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostTypeWithId>
}