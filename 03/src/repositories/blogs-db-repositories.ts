import {blogType, bodyBlogType} from "./types-blogs-repositories";
import {blogsCollection} from "../db";
import {ObjectId} from "mongodb";

function renameMongoIdBlog(blog: any
): blogType {
    blog.id = blog._id;
    delete blog._id;
    return blog;
}

export const blogsDbRepositories = {

    async getAllBlogs(): Promise<Array<blogType>> {

        const allBlogs = await blogsCollection.find({}).toArray();
        return allBlogs.map(p => renameMongoIdBlog(p))
    },

    async createBlog(blog: blogType): Promise<void> {

        await blogsCollection.insertOne(blog);
        return;
    },

    async getSingleBlog(id: string): Promise<null | blogType> {

        return await blogsCollection.findOne({_id: new ObjectId(id)});
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