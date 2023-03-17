import {bodyPostType, postType} from "./types-posts-repositories";
import {allBlogs} from "./blogs-repositories";
import {CountElemOfPost} from "../middlewares/posts-middlewares";

export let allPosts: Array<postType> = [];
let post: postType;
export const postsRepositories = {

    createPost(body: bodyPostType): postType {

        post = {
            id: Date.now().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: allBlogs[CountElemOfPost].name
        }

        allPosts.push(post);

        return post
    },

    updatePost(bodyPost: bodyPostType, id: number) {
        for ( let key of allPosts ) {

            if ( +key.id === id ) {

                key.title = bodyPost.title;
                key.shortDescription = bodyPost.shortDescription;
                key.content = bodyPost.content;

                return true
            }
        }
        return false
    },

    deleteSinglePost(id: number) {
        for ( let i = 0; i < allPosts.length; i++ ) {

            if ( +allPosts[i].id === id ) {
                allPosts.splice(i, 1)

                return true
            }
        }
        return false
    }
}