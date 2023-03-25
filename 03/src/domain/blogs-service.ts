import {bodyBlogType, blogType} from "../repositories/types-blogs-repositories";
import {blogsDbRepositories} from "../repositories/blogs-db-repositories";
import {bodyPostByBlogIdType, postType} from "../repositories/types-posts-repositories";
import {blogsCollection} from "../db";
import {renameMongoIdPost} from "./posts-service";
import {ObjectId} from "mongodb";

export function renameMongoIdBlog(blog: any //TODO тип
): blogType {
    blog.id = blog._id;
    delete blog._id;
    return blog;
}

export const blogsService = {

    async createBlog(bodyBlog: bodyBlogType): Promise<blogType> {

        const blog: blogType = {
            ...bodyBlog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsDbRepositories.createBlog(blog);
        renameMongoIdBlog(blog);

        return blog;
    },

    async createPostByBlogId(blogId: string, body: bodyPostByBlogIdType): Promise<null | postType> {
        // проверка в БД наличия блога - нормально для бизнес слоя?
        const hasCollectionBlogId = await blogsCollection.findOne({_id: new ObjectId(blogId) });

        if (hasCollectionBlogId) {
            const post: postType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: hasCollectionBlogId.name,
                createdAt: new Date().toISOString()
            };
            await blogsDbRepositories.createPostByBlogId(post);
            renameMongoIdPost(post)

            return post
        }

        return null
    },

    async updateBlog(bodyBlog: bodyBlogType, id: string): Promise<boolean> {

        return await blogsDbRepositories.updateBlog(bodyBlog, id);
    },

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await blogsDbRepositories.deleteSingleBlog(id);
    }
}