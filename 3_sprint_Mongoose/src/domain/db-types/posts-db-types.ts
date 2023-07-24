import {ObjectId} from "mongodb";

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