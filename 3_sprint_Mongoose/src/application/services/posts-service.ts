import {
    BodyPostType,
} from "../../infrastructure/repositories/repositories-types/posts-types-repositories";
import {PostsRepository} from "../../infrastructure/repositories/posts-repository";
import {BlogsQueryRepository} from "../../infrastructure/queryRepository/blogs-query-repository";
import {ObjectId} from "mongodb";
import {ResponseTypeService} from "./service-types/responses-types-service";
import {createResponseService} from "./service-utils/functions/create-response-service";
import {PostDBType} from "../../types/db-types";
import {renameMongoIdPost} from "../../helpers/functions/posts-functions-helpers";
import { injectable } from "inversify";
import {LikeStatus} from "../../helpers/enums/like-status";
import {PostsQueryRepository} from "../../infrastructure/queryRepository/posts-query-repository";
import {LikesInfoQueryRepository} from "../../infrastructure/queryRepository/likes-info-query-repository";
import {LikesInfoService} from "./likes-info-service";


@injectable()
export class PostsService {

    constructor(protected postsRepository: PostsRepository,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository,
                protected likesInfoQueryRepository: LikesInfoQueryRepository,
                protected likesInfoService: LikesInfoService) {
    }

    async createPost(body: BodyPostType): Promise<ResponseTypeService> {

        const blog = await this.blogsQueryRepository.getSingleBlog(body.blogId);
        if (!blog) {
            return createResponseService(400, {
                errorsMessages: [{
                    message: "Such blogId is not found",
                    field: "blogId"
                }]
            })
        }

        const post = new PostDBType(
            new ObjectId(),
            body.title,
            body.shortDescription,
            body.content,
            body.blogId,
            blog.name,
            new Date().toISOString()
        )

        await this.postsRepository.createPost(post);
        const postMapped = renameMongoIdPost(post);

        return createResponseService(201, postMapped)
    }

    async updatePost(body: BodyPostType, id: string): Promise<ResponseTypeService> {

        const blog = await this.blogsQueryRepository.getSingleBlog(body.blogId);
        if (!blog) {
            return createResponseService(400, {
                errorsMessages: [{
                    message: "Such blogId is not found",
                    field: "blogId"
                }]
            })
        }

        const result = await this.postsRepository.updatePost(body, id);
        if (!result) {
            return createResponseService(404, 'Not found');
        }
        return createResponseService(204, 'No content');
    }

    async updateLikeStatusOfPost(postId: string, userId: ObjectId, likeStatus: LikeStatus) {

        const post = await this.postsQueryRepository.getPostById(postId, userId);
        if (!post) {
            return false;
        }

        if (likeStatus === 'Like' || likeStatus === 'Dislike') {

            //Получаю like info
            const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByPostAndUser(new ObjectId(postId), userId);
            if (!likeInfo) { //если нету такого документа
                //Увеличиваю количество лайков/дизлайков
                const result = await this.postsRepository.incrementNumberOfLikeOfPost(postId, likeStatus);
                if (!result) {
                    throw new Error('Incrementing number of likes failed');
                }
                //Создаю like info
                await this.likesInfoService.createLikeInfoComment(userId, new ObjectId(postId), likeStatus);
                return true;
            }

            //Если информация уже есть, то меняем статус лайка
            const isUpdate = await this.likesInfoService.updateLikeInfoComment(userId, new ObjectId(postId), likeStatus);
            if (isUpdate) {//если изменился, то
                //увеличиваю на 1
                const result1 = await this.commentsRepository.incrementNumberOfLikeOfComment(postId, likeStatus);
                if (!result1) {
                    throw new Error('Incrementing number of likes failed');
                }
                //уменьшаю на 1 тоЮ что убрали
                const result2 = await this.commentsRepository.decrementNumberOfLikeOfComment(postId, likeInfo.statusLike);
                if (!result2) {
                    throw new Error('Decrementing number of likes failed');
                }
                return true;

            } else {
                return true;
            }

        } else {

            const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(new ObjectId(postId), userId);
            if (!likeInfo) {
                throw new Error(`Status of like is already 'None', it can't be changed`)
            }


            const result = await this.commentsRepository.decrementNumberOfLikeOfComment(postId, likeInfo.statusLike);
            if (!result) {
                throw new Error('Decrementing number of likes failed');
            }

            const isDeleted = await this.likesInfoService.deleteLikeInfoComment(userId, new ObjectId(postId))
            if (!isDeleted) {
                throw new Error('Deleting like info of comment failed');
            }

            return true;
        }
    }

    async deleteSinglePost(id: string): Promise<boolean> {

        return await this.postsRepository.deleteSinglePost(id);
    }
}

