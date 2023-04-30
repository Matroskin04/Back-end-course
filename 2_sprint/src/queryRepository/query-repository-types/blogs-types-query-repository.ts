import {BlogType} from "../../repositories/repositories-types/blogs-types-repositories";
import {PostType} from "../../repositories/repositories-types/posts-types-repositories";

export type BlogPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<BlogType>
}

export type PostsOfBlogPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostType>
}