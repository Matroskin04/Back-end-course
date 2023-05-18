import {
    BodyBlogType,
    BlogTypeWithId
} from "../repositories/repositories-types/blogs-types-repositories";
import {blogsRepositoriy} from "../repositories/blogs-repositoriy";
import {
    BodyPostByBlogIdType,
    PostTypeWithId
} from "../repositories/repositories-types/posts-types-repositories";
import {renameMongoIdPost} from "./posts-service";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {ObjectId} from "mongodb";
import {BlogDBType, PostDBType} from "../types/types";

export function renameMongoIdBlog(blog: any
): BlogTypeWithId {
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}
export const blogsService = {

    async createBlog(bodyBlog: BodyBlogType): Promise<BlogTypeWithId> {

        const blog: BlogDBType = {
            ...bodyBlog,
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsRepositoriy.createBlog(blog);
        return renameMongoIdBlog(blog);
    },

    async createPostByBlogId(blogId: string, body: BodyPostByBlogIdType): Promise<null | PostTypeWithId> {
        //checking the existence of a blog
        const hasCollectionBlogId = await blogsQueryRepository.getSingleBlog(blogId);

        if (hasCollectionBlogId) {
            const post: PostDBType = {
                _id: new ObjectId(),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: hasCollectionBlogId.name,
                createdAt: new Date().toISOString()
            };
            await blogsRepositoriy.createPostByBlogId(post);
            return renameMongoIdPost(post)
        }

        return null
    },

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

        return await blogsRepositoriy.updateBlog(bodyBlog, id);
    },

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await blogsRepositoriy.deleteSingleBlog(id);
    }
}