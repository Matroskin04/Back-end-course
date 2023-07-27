import mongoose from "mongoose";
import {PostDBFullType, PostDBType} from "./db-types/posts-db-types";
import {ObjectId} from "mongodb";
import {BodyPostType} from "../infrastructure/repositories/repositories-types/posts-types-repositories";

const PostSchema = new mongoose.Schema<PostDBType, PostDBFullType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId:	{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true}
    }
});

PostSchema.static('makeInstance', function makeInstance(postBody: BodyPostType, blogName: string) {
    return new PostModel({
        _id: new ObjectId(),
        title: postBody.title,
        shortDescription: postBody.shortDescription,
        content: postBody.content,
        blogId: postBody.blogId,
        blogName: blogName,
        createdAt: new Date().toISOString(),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0
        }
    })
});


export const PostModel = mongoose.model<PostDBType, PostDBFullType>('posts', PostSchema);

