import {bodyPostType, postType} from "./types-posts-repositories";
import {blogsCollection, postsCollection} from "../db";
import {ObjectId} from "mongodb";

function renameMongoIdPost(post: any
): postType {
    post.id = post._id;
    delete post._id;
    return post;
}
export const postsRepositories = {

    async getAllPosts() {

        const allPosts = await postsCollection.find({}).toArray();
        return allPosts.map(p => renameMongoIdPost(p));
    },

    async createPost(body: bodyPostType): Promise<postType> {

        const blogName = await blogsCollection.find( { _id: new ObjectId(body.blogId) } ).toArray();

        const post: postType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName[0].name,
            createdAt: new Date().toISOString()
        };

        await postsCollection.insertOne(post);
        renameMongoIdPost(post);

        return post;
    },

    async getSinglePost(id: string): Promise<postType | null> {

        const singlePost = await postsCollection.findOne({_id: new ObjectId(id)});
        return renameMongoIdPost(singlePost);
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