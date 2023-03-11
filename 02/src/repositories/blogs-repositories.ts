import {blog, bodyBlogType} from "../types";

let allBlogs: Array<blog> = [];


export const blogsRepositories = {

    getBlogs() {
        return allBlogs
    },

    createBlog(bodyBlog: bodyBlogType) {

        const blog = {
            id: Date.now().toString(),
            ...bodyBlog
        }
        allBlogs.push(blog);

        return blog
    }
}