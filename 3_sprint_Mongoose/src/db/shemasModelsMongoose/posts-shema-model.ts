import mongoose from "mongoose";
import {PostDBType} from "../../types/db-types";

export const PostSchema = new mongoose.Schema<PostDBType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId:	{type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
});
export const PostModel = mongoose.model<PostDBType>('posts', PostSchema);