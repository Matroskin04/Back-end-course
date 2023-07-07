import {BodyBlogType} from "./repositories-types/blogs-types-repositories";
import {ObjectId} from "mongodb";
import {BlogModel} from "../db/shemasModelsMongoose/blogs-schema-model";
import {PostModel} from "../db/shemasModelsMongoose/posts-schema-model";
import {BlogDBType, PostDBType} from "../types/db-types";

export class BlogsRepository {
    async createBlog(blog: BlogDBType): Promise<void> {

        await BlogModel.create(blog);
        return;
    }

    async createPostByBlogId(post: PostDBType): Promise<void> {

        await PostModel.create(post);
        return;
    }

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

        const result = await BlogModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: bodyBlog.name,
                description: bodyBlog.description,
                websiteUrl: bodyBlog.websiteUrl
            }
        })

        return result.modifiedCount === 1;
    }

    async deleteSingleBlog(id: string): Promise<boolean> {

        const result = await BlogModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

}