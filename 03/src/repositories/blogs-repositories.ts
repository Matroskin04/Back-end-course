import {blog, bodyBlogType} from "../types";

export let allBlogs: Array<blog> = [];


export const blogsRepositories = {

    createBlog(bodyBlog: bodyBlogType): blog {

        const blog = {
            id: Date.now().toString(),
            ...bodyBlog
        }
        allBlogs.push(blog);

        return blog
    },

    getSingleBlogs(id: number) {
        return allBlogs.find( p => +p.id === id );
    },

    updateBlog(bodyBlog: bodyBlogType, id: number) {
        for ( let key of allBlogs ) {

            if ( +key.id === id ) {

              key.name = bodyBlog.name;
              key.description = bodyBlog.description;
              key.websiteUrl = bodyBlog.websiteUrl;

              return true;
            }
        }

        return false;
    },

    deleteSingleBlog(id: number) {
        for ( let i = 0; i < allBlogs.length; i++ ) {

            if ( +allBlogs[i].id === id ) {
                allBlogs.splice(i, 1)

                return true
            }
        }
        return false
    }
}