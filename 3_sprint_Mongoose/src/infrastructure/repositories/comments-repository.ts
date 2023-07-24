import { injectable } from "inversify";
import {ObjectId} from "mongodb";
import {CommentModel} from "../../domain/comments-schema-model";
import {CommentDBType} from "../../domain/db-types/comments-db-types";

@injectable()
export class CommentsRepository {

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {content: content}});
        return;
    }

    async deleteComment(id: string): Promise<void> {

        await CommentModel.deleteOne({_id: new ObjectId(id)});
        return;
    }

    async createCommentByPostId(comment: CommentDBType): Promise<void> {

        const commentInstance = new CommentModel(comment);
        await commentInstance.save();

        return;
    }

    async incrementNumberOfLikesOfComment(commentId: string, likeStatus: 'Like' | 'Dislike'): Promise<boolean> {

        if (likeStatus === 'Like') {
            const result = await CommentModel.updateOne({_id: commentId}, {$inc: {'likesInfo.likesCount': 1}});
            return result.modifiedCount === 1;

        } else {
            const result = await CommentModel.updateOne({_id: commentId}, {$inc: {'likesInfo.dislikesCount': 1}});
            return result.modifiedCount === 1;

        }
    }

    async decrementNumberOfLikesOfComment(_id: string, decrementValue: 'Like' | 'Dislike'): Promise<boolean> {

        if (decrementValue === 'Like') {
            const result = await CommentModel.updateOne({_id}, {$inc: {'likesInfo.likesCount': -1}});
            return result.modifiedCount === 1;

        } else {
            const result = await CommentModel.updateOne({_id}, {$inc: {'likesInfo.dislikesCount': -1}});
            return result.modifiedCount === 1;

        }
    }
}
