import {BodyBlogType} from "./repositories-types/blogs-types-repositories";
import {ObjectId} from "mongodb";
import {BlogModel} from "../db/shemasModelsMongoose/blogs-schema-model";
import {PostModel} from "../db/shemasModelsMongoose/posts-schema-model";
import {BlogDBType, PostDBType} from "../types/db-types";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
    async createBlog(blog: BlogDBType): Promise<void> {

        const blogInstance = new BlogModel(blog);
        await blogInstance.save();
        return;
    }

    async createPostByBlogId(post: PostDBType): Promise<void> {

        const postInstance = new PostModel(post);
        await postInstance.save();
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