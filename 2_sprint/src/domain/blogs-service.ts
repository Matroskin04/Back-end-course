import {
    BodyBlogType,
    BlogType,
    BlogTypeWithId
} from "../repositories/repositories-types/blogs-types-repositories";
import {blogsDbRepositories} from "../repositories/blogs-db-repositories";
import {BodyPostByBlogIdType, PostType} from "../repositories/repositories-types/posts-types-repositories";
import {renameMongoIdPost} from "./posts-service";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";

export function renameMongoIdBlog(blog: any //Todo иммутабельность
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

    async createBlog(bodyBlog: BodyBlogType): Promise<BlogType> {

        const blog: BlogType = {
            ...bodyBlog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsDbRepositories.createBlog(blog);
        return renameMongoIdBlog(blog);
    },

    async createPostByBlogId(blogId: string, body: BodyPostByBlogIdType): Promise<null | PostType> {
        //checking the existence of a blog
        const hasCollectionBlogId = await blogsQueryRepository.getSingleBlog(blogId);

        if (hasCollectionBlogId) {
            const post: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: hasCollectionBlogId.name,
                createdAt: new Date().toISOString()
            };
            await blogsDbRepositories.createPostByBlogId(post);
            return renameMongoIdPost(post)
        }

        return null
    },

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

        return await blogsDbRepositories.updateBlog(bodyBlog, id);
    },

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await blogsDbRepositories.deleteSingleBlog(id);
    }
}