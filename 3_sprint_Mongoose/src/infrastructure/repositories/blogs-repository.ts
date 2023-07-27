import {ObjectId} from "mongodb";
import {BlogModel} from "../../domain/blogs-schema-model";
import { injectable } from "inversify";
import {HydratedBlogType} from "../../domain/db-types/blogs-db-types";

@injectable()
export class BlogsRepository {
    async saveBlog(blog: HydratedBlogType): Promise<void> { //todo типизацию в другое место файл

        await blog.save();
        return;
    }

    async deleteSingleBlog(id: string): Promise<boolean> {

        const result = await BlogModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async getBlogById(id: string): Promise<null | HydratedBlogType> {

        const blog = await BlogModel.findOne({_id: new ObjectId(id)});

        if (blog) {
            return blog;
        }
        return null;
    }

}