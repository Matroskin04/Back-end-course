import {
    BodyPostType,
    PostTypeWithId
} from "../repositories/repositories-types/posts-types-repositories";
import {postsRepository} from "../repositories/posts-repository";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {ObjectId} from "mongodb";
import {PostDBType} from "../types/types";

export function renameMongoIdPost(post: any
): PostTypeWithId {
    return {
        id:	post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId:	post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsService = {

    async createPost(body: BodyPostType): Promise<PostTypeWithId | null> {

        const blog = await blogsQueryRepository.getSingleBlog(body.blogId);
        if (!blog) {
            return null
        }

        const post: PostDBType = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        };

        await postsRepository.createPost(post);
        return renameMongoIdPost(post)
    },

    async updatePost(body: BodyPostType, id: string): Promise<boolean> {

        const blog = await blogsQueryRepository.getSingleBlog(body.blogId);
        if (!blog) {
            return false
        }

        return await postsRepository.updatePost(body, id);
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        return await postsRepository.deleteSinglePost(id);
    }
}