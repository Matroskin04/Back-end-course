import {bodyPostType, postType} from "./types-posts-repositories";
import {commentsCollection, postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {commentType} from "./types-comments-repositories";


export const postsRepositories = {

    async createPost(post: postType): Promise<void> {

        await postsCollection.insertOne(post);
        return;
    },

    async createCommentByPostId(comment: commentType): Promise<void> {

        await commentsCollection.insertOne(comment);
        return;
    },

    async updatePost(bodyPost: bodyPostType, id: string): Promise<boolean> {

        const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: bodyPost.title,
                shortDescription: bodyPost.shortDescription,
                content: bodyPost.content
            }
        });

        return result.modifiedCount > 0;
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount > 0;
    }
}