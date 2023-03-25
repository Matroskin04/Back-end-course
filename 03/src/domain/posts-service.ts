import {bodyPostType, postType} from "../repositories/types-posts-repositories";
import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";
import {postsRepositories} from "../repositories/posts-repositories";

export function renameMongoIdPost(post: any
): postType {
    post.id = post._id;
    delete post._id;
    return post;
}

export const postsService = {

    async createPost(body: bodyPostType): Promise<postType> {

        const blogName = await blogsCollection.find( { _id: new ObjectId(body.blogId) } ).toArray(); //TODO запрос в repo для проверка наличия блога

        const post: postType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName[0].name,
            createdAt: new Date().toISOString()
        };
        await postsRepositories.createPost(post);
        renameMongoIdPost(post);

        return post;
    },

    async updatePost(body: bodyPostType, id: string): Promise<boolean> {

        return await postsRepositories.updatePost(body, id);
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        return await postsRepositories.deleteSinglePost(id);
    }
}