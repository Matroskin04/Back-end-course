import {bodyBlogType, blogType} from "../repositories/types-blogs-repositories";
import {blogsDbRepositories} from "../repositories/blogs-db-repositories";

function renameMongoIdBlog(blog: any
): blogType {
    blog.id = blog._id;
    delete blog._id;
    return blog;
}

export const blogsService = {

    async getAllBlogs(): Promise<Array<blogType>> {

        return await blogsDbRepositories.getAllBlogs();
    },

    async createBlog(bodyBlog: bodyBlogType): Promise<blogType> {

        const blog: blogType = {
            ...bodyBlog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        await blogsDbRepositories.createBlog(blog);
        renameMongoIdBlog(blog);

        return blog;
    },

    async getSingleBlog(id: string): Promise<null | blogType> {

        const singleBlog = await blogsDbRepositories.getSingleBlog(id);

        if (singleBlog) {
            return renameMongoIdBlog(singleBlog);
        }
        return null;
    },

    async updateBlog(bodyBlog: bodyBlogType, id: string): Promise<boolean> {

        return await blogsDbRepositories.updateBlog(bodyBlog, id);
    },

    async deleteSingleBlog(id: string): Promise<boolean> {

        return await blogsDbRepositories.deleteSingleBlog(id);
    }
}