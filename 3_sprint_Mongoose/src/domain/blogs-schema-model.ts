import mongoose from "mongoose";
import {BlogDBType} from "../types/db-types";

export const BlogSchema = new mongoose.Schema<BlogDBType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
});
export const BlogModel = mongoose.model<BlogDBType>('blogs', BlogSchema);