import {BodyBlogType} from "./repositories-types/blogs-types-repositories";
import {blogsCollection, postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {BlogDBType, PostDBType} from "../types/types";


export const blogsRepositories = {


    async createBlog(blog: BlogDBType): Promise<void> {

        await blogsCollection.insertOne(blog);
        return;
    },

    async createPostByBlogId(post: PostDBType): Promise<void> {

        await postsCollection.insertOne(post);
        return;
    },

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

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