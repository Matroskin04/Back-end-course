import {
    BodyBlogType,
    BlogTypeWithId
} from "../repositories/repositories-types/blogs-types-repositories";
import {blogsRepository} from "../repositories/blogs-repository";
import {
    BodyPostByBlogIdType,
    PostTypeWithId
} from "../repositories/repositories-types/posts-types-repositories";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {ObjectId} from "mongodb";
import {BlogDBType, PostDBType} from "../types/db-types";
import {renameMongoIdBlog} from "../helpers/functions/blogs-functions-helpers";
import {renameMongoIdPost} from "../helpers/functions/posts-functions-helpers";


class BlogsService {

    async createBlog(bodyBlog: BodyBlogType): Promise<BlogTypeWithId> {

        const blog = new BlogDBType(
            new ObjectId(),
            bodyBlog.name,
            bodyBlog.description,
            bodyBlog.websiteUrl,
            new Date().toISOString(),
            false
        )

        await blogsRepository.createBlog(blog);
        return renameMongoIdBlog(blog);
    }

    async createPostByBlogId(blogId: string, body: BodyPostByBlogIdType): Promise<null | PostTypeWithId> {
        //checking the existence of a blog
        const blog = await blogsQueryRepository.getSingleBlog(blogId);
        if (!blog) {
            return null
        }

        const post = new PostDBType(
            new ObjectId(),
            body.title,
            body.shortDescription,
            body.content,
            blogId,
            blog.name,
            new Date().toISOString()
        )

        await blogsRepository.createPostByBlogId(post);
        return renameMongoIdPost(post)
    }

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

        return await blogsRepository.updateBlog(bodyBlog, id);
    }

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await blogsRepository.deleteSingleBlog(id);
    }
}

export const blogsService = new BlogsService();