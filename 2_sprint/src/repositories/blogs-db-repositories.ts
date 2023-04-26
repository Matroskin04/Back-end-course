import {blogType, bodyBlogType} from "./types-blogs-repositories";
import {blogsCollection, postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {postType} from "./types-posts-repositories";


export const blogsDbRepositories = {


    async createBlog(blog: blogType): Promise<void> {

        await blogsCollection.insertOne(blog);
        return;
    },

    async createPostByBlogId(post: postType): Promise<void> {

        await postsCollection.insertOne(post);
        return;
    },

    async updateBlog(bodyBlog: bodyBlogType, id: string): Promise<boolean> {

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: bodyBlog.name,
                description: bodyBlog.description,
                websiteUrl: bodyBlog.websiteUrl
            }
        })

        return result.modifiedCount > 0;
    },

    async deleteSingleBlog(id: string): Promise<boolean> {

        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount > 0;
    }
}