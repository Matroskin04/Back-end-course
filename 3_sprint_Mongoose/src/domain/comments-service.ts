import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ObjectId} from "mongodb";
import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {PostModel} from "../db/shemasModelsMongoose/posts-schema-model";
import {mappingComment} from "../helpers/functions/comments-functions-helpers";
import {CommentDBType} from "../types/db-types";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersQueryRepository} from "../queryRepository/users-query-repository";
import {LikeStatus} from "../helpers/enums/like-status";
import {CommentsQueryRepository} from "../queryRepository/comments-query-repository";
import {LikesInfoService} from "./likes-info-service";
import {LikesInfoQueryRepository} from "../queryRepository/likes-info-query-repository";
import { injectable } from "inversify";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository,
                protected usersQueryRepository: UsersQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository,
                protected likesInfoService: LikesInfoService,
                protected likesInfoQueryRepository: LikesInfoQueryRepository) {
    }

    async updateComment(id: string, idFromToken: string, content: string): Promise<void> {

        await this.commentsRepository.updateComment(id, idFromToken, content);
        return;
    }

    async deleteComment(id: string): Promise<void> {

        await this.commentsRepository.deleteComment(id);
        return;
    }

    async createCommentByPostId(body: CreateCommentByPostIdModel, userId: ObjectId, postId: string): Promise<null | CommentOutputType> {

        const user = await this.usersQueryRepository.getUserByUserId(userId)
        if (!user) {
            return null;
        }

        const post = await PostModel.findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null;
        }

        const comment = new CommentDBType(
            new ObjectId(),
            body.content,
            {
                userId: userId.toString(),
                userLogin: user.login
            },
            new Date().toISOString(),
            postId,
            {
                likesCount: 0,
                dislikesCount: 0
            }
        )


        await this.commentsRepository.createCommentByPostId(comment);
        return mappingComment(comment, 'None');
    }

    async updateLikeStatusOfComment(commentId: string, userId: ObjectId, statusLike: LikeStatus): Promise<boolean> {

        const comment = await this.commentsQueryRepository.getCommentById(commentId, userId);
        if (!comment) {
            return false;
        }

        if (statusLike === 'Like' || statusLike === 'Dislike') {

            //Получаю like info
            const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(new ObjectId(commentId), userId);
            if (!likeInfo) { //если нету такого документа
                //Увеличиваю количество лайков/дизлайков
                const result = await this.commentsRepository.incrementNumberOfLikeOfComment(commentId, statusLike);
                if (!result) {
                    throw new Error('Incrementing number of likes failed');
                }
                //Создаю like info
                await this.likesInfoService.createLikeInfoComment(userId, new ObjectId(commentId), statusLike);
                return true;
            }

            //Если информация уже есть, то меняем статус лайка
            const isUpdate = await this.likesInfoService.updateLikeInfoComment(userId, new ObjectId(commentId), statusLike);
            if (isUpdate) {//если изменился, то
                //увеличиваю на 1
                const result1 = await this.commentsRepository.incrementNumberOfLikeOfComment(commentId, statusLike);
                if (!result1) {
                    throw new Error('Incrementing number of likes failed');
                }
                //уменьшаю на 1 тоЮ что убрали
                const result2 = await this.commentsRepository.decrementNumberOfLikeOfComment(commentId, likeInfo.statusLike);
                if (!result2) {
                    throw new Error('Decrementing number of likes failed');
                }
                return true;

            } else {
                return true;
            }

        } else {

            const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(new ObjectId(commentId), userId);
            if (!likeInfo) {
                throw new Error(`Status of like is already 'None', it can't be changed`)
            }


            const result = await this.commentsRepository.decrementNumberOfLikeOfComment(commentId, likeInfo.statusLike);
            if (!result) {
                throw new Error('Decrementing number of likes failed');
            }

            const isDeleted = await this.likesInfoService.deleteLikeInfoComment(userId, new ObjectId(commentId))
            if (!isDeleted) {
                throw new Error('Deleting like info of comment failed');
            }

            return true;
        }
    }
}

