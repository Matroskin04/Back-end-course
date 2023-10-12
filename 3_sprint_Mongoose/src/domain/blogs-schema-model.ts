import {BlogDBFullType, BlogDBInstanceMethodsType, BlogDBType, HydratedBlogType} from "./db-types/blogs-db-types";
import {ObjectId} from "mongodb";
import {
    BlogTypeWithId,
    BlogTypeWithMongoId, BodyBlogType
} from "../infrastructure/repositories/repositories-types/blogs-types-repositories";
import mongoose from "mongoose";

export const BlogSchema = new mongoose.Schema<BlogDBType, BlogDBFullType, BlogDBInstanceMethodsType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
});
BlogSchema.static('makeInstance', function makeInstance(name: string, description: string, websiteUrl: string, isMembership: boolean = false): HydratedBlogType {
    return new BlogModel({
        _id: new ObjectId(),
        name,
        description,
        websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership
    })
});
BlogSchema.method('renameIntoViewModel', function renameIntoViewModel(): BlogTypeWithId {
    const that = this as BlogTypeWithMongoId
    return {
        id: that._id,
        name: that.name,
        description: that.description,
        websiteUrl: that.websiteUrl,
        createdAt: that.createdAt,
        isMembership: that.isMembership
    }
});
BlogSchema.method('updateBlogInfo', function updateBlogInfo(updateData: BodyBlogType): void {
    this.name = updateData.name;
    this.description = updateData.description;
    this.websiteUrl = updateData.websiteUrl;
    return;
})


export const BlogModel = mongoose.model<BlogDBType, BlogDBFullType>('blogs', BlogSchema);