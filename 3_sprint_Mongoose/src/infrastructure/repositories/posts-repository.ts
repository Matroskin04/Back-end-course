import {BodyPostType} from "./repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {PostModel} from "../../domain/posts-schema-model";
import { injectable } from "inversify";
import {PostDBType} from "../../domain/db-types/posts-db-types";


@injectable()
export class PostsRepository {


    async createPost(post: PostDBType): Promise<void> {

        const postInstance = new PostModel(post);
        await postInstance.save();

        return;
    }

    async createPostByBlogId(post: PostDBType): Promise<void> {

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

    async incrementNumberOfLikesOfPost(postId: string, incrementValue: 'Like' | 'Dislike' | 'None'): Promise<boolean> {

        if (incrementValue === 'Like') {
            const result = await PostModel.updateOne({_id: postId}, {$inc: {'likesInfo.likesCount': 1}});
            return result.modifiedCount === 1;

        }
        if (incrementValue === 'Dislike') {
            const result = await PostModel.updateOne({_id: postId}, {$inc: {'likesInfo.dislikesCount': 1}});
            return result.modifiedCount === 1;

        }
        return true
    }

    async decrementNumberOfLikesOfPost(postId: string, decrementValue: 'Like' | 'Dislike' | 'None'): Promise<boolean> {

        if (decrementValue === 'Like') {
            const result = await PostModel.updateOne({_id: postId}, {$inc: {'likesInfo.likesCount': -1}});
            return result.modifiedCount === 1;

        }
        if (decrementValue === 'Dislike') {
            const result = await PostModel.updateOne({_id: postId}, {$inc: {'likesInfo.dislikesCount': -1}});
            return result.modifiedCount === 1;
        }
        return true
    }
}
