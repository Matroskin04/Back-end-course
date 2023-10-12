import {ObjectId} from "mongodb";
import {Model} from "mongoose";
import {BlogDBType} from "./blogs-db-types";
import {BodyPostType} from "../../infrastructure/repositories/repositories-types/posts-types-repositories";

export class PostDBType {
    constructor(public _id: ObjectId,
                public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                public blogName: string,
                public createdAt: string,
                public likesInfo: {
                    likesCount: number,
                    dislikesCount: number
                }
    ) {
    }
}

// export type PostDBInstanceMethodsType = {
//     renameIntoViewModel: () => BlogTypeWithId;
//     updateBlogInfo: (blog: HydratedBlogType, updateData: BodyBlogType) => void
// };

export type PostDBStaticMethodsType = {
    makeInstance: (postBody: BodyPostType, blogName: string) => any;
};


export type PostDBFullType = Model<PostDBType> & PostDBStaticMethodsType;

// export type PostDBType = {
//     _id: ObjectId
//     title: string
//     shortDescription: string
//     content: string
//     blogId: string
//     blogName: string
//     createdAt: string
//     likesInfo: {
//         likesCount: number
//         dislikesCount: number
//     }
// }