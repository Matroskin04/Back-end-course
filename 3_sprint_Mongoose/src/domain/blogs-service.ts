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

        const blog: BlogDBType = {
            ...bodyBlog,
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsRepository.createBlog(blog);
        return renameMongoIdBlog(blog);
    }

    async createPostByBlogId(blogId: string, body: BodyPostByBlogIdType): Promise<null | PostTypeWithId> {
        //checking the existence of a blog
        const hasCollectionBlogId = await blogsQueryRepository.getSingleBlog(blogId);
        if (!hasCollectionBlogId) {
            return null
        }

        const post: PostDBType = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: blogId,
            blogName: hasCollectionBlogId.name,
            createdAt: new Date().toISOString()
        }

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