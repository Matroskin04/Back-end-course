import {
    BodyBlogType,
    BlogTypeWithId
} from "../repositories/repositories-types/blogs-types-repositories";
import {
    BodyPostByBlogIdType,
    PostTypeWithId
} from "../repositories/repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {BlogDBType, PostDBType} from "../types/db-types";
import {renameMongoIdBlog} from "../helpers/functions/blogs-functions-helpers";
import {renameMongoIdPost} from "../helpers/functions/posts-functions-helpers";
import {BlogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {BlogsRepository} from "../repositories/blogs-repository";
import { injectable } from "inversify";


@injectable()
export class BlogsService {

    constructor(protected blogsRepository: BlogsRepository,
                protected blogsQueryRepository: BlogsQueryRepository) {}

    async createBlog(bodyBlog: BodyBlogType): Promise<BlogTypeWithId> {

        const blog = new BlogDBType(
            new ObjectId(),
            bodyBlog.name,
            bodyBlog.description,
            bodyBlog.websiteUrl,
            new Date().toISOString(),
            false
        )

        await this.blogsRepository.createBlog(blog);
        return renameMongoIdBlog(blog);
    }

    async createPostByBlogId(blogId: string, body: BodyPostByBlogIdType): Promise<null | PostTypeWithId> {
        //checking the existence of a blog
        const blog = await this.blogsQueryRepository.getSingleBlog(blogId);
        if (!blog) {
            return null
        }

        const post = new PostDBType(
            new ObjectId(),
            body.title,
            body.shortDescription,
            body.content,
            blogId,
            blog.name,
            new Date().toISOString()
        )

        await this.blogsRepository.createPostByBlogId(post);
        return renameMongoIdPost(post)
    }

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

        return await this.blogsRepository.updateBlog(bodyBlog, id);
    }

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await this.blogsRepository.deleteSingleBlog(id);
    }
}


