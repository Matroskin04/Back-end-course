import {BodyPostType} from "./repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {PostModel} from "../../domain/posts-schema-model";
import {PostDBType} from "../../types/db-types";
import { injectable } from "inversify";


@injectable()
export class PostsRepository {

    async createPost(post: PostDBType): Promise<void> {

        const postInstance = new PostModel(post);
        await postInstance.save();

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
