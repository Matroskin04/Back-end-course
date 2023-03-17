import {blogType, bodyBlogType} from "./types-blogs-repositories";

export let allBlogs: Array<blogType> = [];


export const blogsDbRepositories = {

    async createBlog(bodyBlog: bodyBlogType): Promise<blogType> {

        const blog = {
            id: Date.now().toString(),
            ...bodyBlog
        }
        allBlogs.push(blog);

        return blog
    },

    async getSingleBlogs(id: number): Promise<undefined | blogType> {
        return allBlogs.find( p => +p.id === id );
    },

    async updateBlog(bodyBlog: bodyBlogType, id: number): Promise<boolean> {
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

    async deleteSingleBlog(id: number): Promise<boolean> {
        for ( let i = 0; i < allBlogs.length; i++ ) {

            if ( +allBlogs[i].id === id ) {
                allBlogs.splice(i, 1)

                return true
            }
        }
        return false
    }
}