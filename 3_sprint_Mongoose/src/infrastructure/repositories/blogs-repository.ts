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

    async deleteSingleBlog(blogId: ObjectId): Promise<boolean> {

        const result = await BlogModel.deleteOne({_id: blogId});
        return result.deletedCount === 1;
    }

    async getBlogById(blogId: ObjectId): Promise<null | HydratedBlogType> {

        const blog = await BlogModel.findOne({_id: blogId});

        if (blog) {
            return blog;
        }
        return null;
    }

}