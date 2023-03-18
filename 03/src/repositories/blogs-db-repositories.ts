import {blogType, bodyBlogType} from "./types-blogs-repositories";
import {blogsCollection} from "../db";



export const blogsDbRepositories = {

    async getAllBlogs(): Promise<Array<blogType>> {

        return blogsCollection.find({}).toArray()
    },

    async createBlog(bodyBlog: bodyBlogType): Promise<blogType> {

        const blog = {
            id: Date.now().toString(),
            ...bodyBlog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsCollection.insertOne(blog);

        return blog;
    },

    async getSingleBlog(id: string): Promise<null | blogType> {

        return await blogsCollection.findOne({id: id});
    },

    async updateBlog(bodyBlog: bodyBlogType, id: string): Promise<boolean> {

        const result = await blogsCollection.updateOne({id: id}, {
            $set: {

                name: bodyBlog.name,
                description: bodyBlog.description,
                websiteUrl: bodyBlog.websiteUrl
            }
        })

        return result.modifiedCount > 0;
    },

    async deleteSingleBlog(id: string): Promise<boolean> {

        const result = await blogsCollection.deleteOne({id: id});

        return result.deletedCount > 0;
    }
}