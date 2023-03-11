import {bodyPostType, postType} from "../types";
import {allBlogs} from "./blogs-repositories";
import {CountElemOfPost} from "../middlewares/posts-middlewares";

export let allPosts: Array<postType> = [];
let post: postType;
export const postsRepositories = {

    getAllPosts() {
        return allPosts;
    },

    createPost(body: bodyPostType) {

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

    getSinglePost(id: number) {
        for (let key of allPosts) {

            if (+key.id === id) {

                return key
            }
        }

        return false
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