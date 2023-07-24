import {ObjectId} from "mongodb";
import {HydratedDocument, Model} from "mongoose";
import {
    BlogTypeWithId,
    BlogTypeWithMongoId
} from "../../infrastructure/repositories/repositories-types/blogs-types-repositories";

// export class BlogDBType {
//     constructor(
//         public _id: ObjectId,
//         public name: string,
//         public description: string,
//         public websiteUrl: string,
//         public createdAt: string,
//         public isMembership: boolean
//     ) {
//     }
// }

export type BlogDBType = {

    _id: ObjectId

    name: string

    description: string

    websiteUrl: string

    createdAt: string

    isMembership: boolean
}

export type HydratedBlogType = HydratedDocument<BlogDBType, BlogDBInstanceMethodsType>;

export type BlogDBInstanceMethodsType = {
    renameIntoViewModel: () => BlogTypeWithId;
};

export type BlogDBStaticMethodsType = {
    makeInstance: (name: string, description: string, websiteUrl: string, isMembership?: boolean) => HydratedBlogType;
};


export type BlogDBFullType = Model<BlogDBType, {}, BlogDBInstanceMethodsType> & BlogDBStaticMethodsType;
