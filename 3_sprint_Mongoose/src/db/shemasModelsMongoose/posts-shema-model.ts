import mongoose from "mongoose";
import {WithId} from "mongodb";
import {PostType} from "../../repositories/repositories-types/posts-types-repositories";

export const PostSchema = new mongoose.Schema<WithId<PostType>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId:	{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
});
export const PostModel = mongoose.model<WithId<PostType>>('posts', PostSchema);