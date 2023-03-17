import {blogType, bodyBlogType} from "./types-blogs-repositories";

export let allBlogs: Array<blogType> = [];


export const blogsRepositories = {

    createBlog(bodyBlog: bodyBlogType): blogType {

        const blog = {
            id: Date.now().toString(),
            ...bodyBlog
        }
        allBlogs.push(blog);

        return blog
    },

    getSingleBlogs(id: number): undefined | blogType {
        return allBlogs.find( p => +p.id === id );
    },

    updateBlog(bodyBlog: bodyBlogType, id: number): boolean {
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

    deleteSingleBlog(id: number): boolean {
        for ( let i = 0; i < allBlogs.length; i++ ) {

            if ( +allBlogs[i].id === id ) {
                allBlogs.splice(i, 1)

                return true
            }
        }
        return false
    }
}