import {bodyPostType, postType} from "./types-posts-repositories";
import {blogsCollection, postsCollection} from "../db";

let post: postType;
export const postsRepositories = {

    async getAllPosts() {

        return postsCollection.find({}).toArray();
    },

    async createPost(body: bodyPostType): Promise<postType> {

        const blogName = await blogsCollection.find( { id: body.blogId } ).toArray()

        post = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName[0].name,
            createdAt: new Date().toISOString()
        }

        await postsCollection.insertOne(post);

        return post
    },

    async getSinglePost(id: string): Promise<postType | null> {

        return await postsCollection.findOne({id: id});
    },

    async updatePost(bodyPost: bodyPostType, id: string): Promise<boolean> {

        const result = await postsCollection.updateOne({id: id}, {
            title: bodyPost.title,
            shortDescription: bodyPost.shortDescription,
            content: bodyPost.content
        });

        return result.modifiedCount > 0;
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        const result = await postsCollection.deleteOne({id: id})

        return result.deletedCount > 0;
    }
}