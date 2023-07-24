import {BodyBlogType} from "./repositories-types/blogs-types-repositories";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../domain/blogs-schema-model";
import { injectable } from "inversify";
import {HydratedBlogType} from "../../domain/db-types/blogs-db-types";

@injectable()
export class BlogsRepository {
    async createBlog(blog: HydratedBlogType): Promise<void> { //todo типизацию в другое место файл

        await blog.save();
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