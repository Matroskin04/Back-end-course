import {bodyBlogType, blogType} from "../repositories/types-blogs-repositories";
import {blogsDbRepositories} from "../repositories/blogs-db-repositories";
import {bodyPostByBlogIdType, postType} from "../repositories/types-posts-repositories";
import {renameMongoIdPost} from "./posts-service";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";

export function renameMongoIdBlog(blog: any
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
        return renameMongoIdBlog(blog);
    },

    async createPostByBlogId(blogId: string, body: bodyPostByBlogIdType): Promise<null | postType> {
        //checking the existence of a blog
        const hasCollectionBlogId = await blogsQueryRepository.getSingleBlog(blogId);

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