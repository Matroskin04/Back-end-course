import {BlogType, BlogTypeWithId} from "../../repositories/repositories-types/blogs-types-repositories";
import {PostType} from "../../repositories/repositories-types/posts-types-repositories";

export type ViewBlogModel = BlogType

export type ViewAllBlogsModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<BlogTypeWithId>
}

export type ViewPostsOfBlogModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: Array<PostType>
}
