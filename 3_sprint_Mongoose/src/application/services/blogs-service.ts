import {
    BodyBlogType,
    BlogTypeWithId
} from "../../infrastructure/repositories/repositories-types/blogs-types-repositories";
import {BlogsQueryRepository} from "../../infrastructure/queryRepositories/blogs-query-repository";
import {BlogsRepository} from "../../infrastructure/repositories/blogs-repository";
import {inject, injectable } from "inversify";
import {BlogModel} from "../../domain/blogs-schema-model";


@injectable()
export class BlogsService {

    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository) {}

    async createBlog(bodyBlog: BodyBlogType): Promise<BlogTypeWithId> {

        const blog = BlogModel.makeInstance(bodyBlog.name, bodyBlog.description, bodyBlog.websiteUrl);
        await this.blogsRepository.saveBlog(blog);

        return blog.renameIntoViewModel();
    }

    async updateBlog(bodyBlog: BodyBlogType, id: string): Promise<boolean> {

        const blog = await this.blogsRepository.getBlogById(id);
        if (!blog) {
            return false
        }

        blog.updateBlogInfo(blog, bodyBlog);
        await this.blogsRepository.saveBlog(blog);

        return true
    }

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await this.blogsRepository.deleteSingleBlog(id);
    }
}


