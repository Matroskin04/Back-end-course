import {BlogDBFullType, BlogDBInstanceMethodsType, BlogDBType, HydratedBlogType} from "./db-types/blogs-db-types";
import {ObjectId} from "mongodb";
import {
    BlogTypeWithId,
    BlogTypeWithMongoId
} from "../infrastructure/repositories/repositories-types/blogs-types-repositories";

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
BlogSchema.method('renameIntoViewModel', function renameIntoViewModel(blog: BlogTypeWithMongoId): BlogTypeWithId {
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
});


export const BlogModel = mongoose.model<BlogDBType, BlogDBFullType>('blogs', BlogSchema);