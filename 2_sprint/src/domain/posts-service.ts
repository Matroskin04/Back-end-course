import {bodyPostType, postType} from "../repositories/types-posts-repositories";
import {postsRepositories} from "../repositories/posts-repositories";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";

export function renameMongoIdPost(post: any
): postType {
    post.id = post._id;
    delete post._id;
    return post;
}

export const postsService = {

    async createPost(body: bodyPostType): Promise<postType> {

        const blogName = await blogsQueryRepository.getSingleBlog(body.blogId);

        const post: postType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName!.name,
            createdAt: new Date().toISOString()
        };
        await postsRepositories.createPost(post);
        return renameMongoIdPost(post)
    },

    async updatePost(body: bodyPostType, id: string): Promise<boolean> {

        return await postsRepositories.updatePost(body, id);
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        return await postsRepositories.deleteSinglePost(id);
    }
}