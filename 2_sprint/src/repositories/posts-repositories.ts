import {BodyPostType, PostDBType} from "./repositories-types/posts-types-repositories";
import {commentsCollection, postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {CommentDBType} from "./repositories-types/comments-types-repositories";


export const postsRepositories = {

    async createPost(post: PostDBType): Promise<void> {

        await postsCollection.insertOne(post);
        return;
    },

    async createCommentByPostId(comment: CommentDBType): Promise<void> {

        await commentsCollection.insertOne(comment);
        return;
    },

    async updatePost(bodyPost: BodyPostType, id: string): Promise<boolean> {

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