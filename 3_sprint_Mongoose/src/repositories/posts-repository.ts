import {BodyPostType} from "./repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {PostModel} from "../db/shemasModelsMongoose/posts-schema-model";
import {PostDBType} from "../types/db-types";


export class PostsRepository {

    async createPost(post: PostDBType): Promise<void> {

        await PostModel.create(post);
        return;
    }

    async updatePost(bodyPost: BodyPostType, id: string): Promise<boolean> {

        const result = await PostModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: bodyPost.title,
                shortDescription: bodyPost.shortDescription,
                content: bodyPost.content
            }
        });

        return result.modifiedCount === 1;
    }

    async deleteSinglePost(id: string): Promise<boolean> {

        const result = await PostModel.deleteOne({_id: new ObjectId(id)})

        return result.deletedCount === 1;
    }
}
