import {BlogType, BodyBlogType} from "./repositories-types/blogs-types-repositories";
import {blogsCollection, postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {PostType} from "./repositories-types/posts-types-repositories";


export const blogsRepositories = {


    async createBlog(blog: BlogType): Promise<void> {

        await blogsCollection.insertOne(blog);
        return;
    },

    async createPostByBlogId(post: PostType): Promise<void> {

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