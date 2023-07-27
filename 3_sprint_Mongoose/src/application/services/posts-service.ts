import {
    BodyPostByBlogIdType,
    BodyPostType, PostTypeWithId,
} from "../../infrastructure/repositories/repositories-types/posts-types-repositories";
import {PostsRepository} from "../../infrastructure/repositories/posts-repository";
import {BlogsQueryRepository} from "../../infrastructure/queryRepositories/blogs-query-repository";
import {ObjectId} from "mongodb";
import {ResponseTypeService} from "./service-types/responses-types-service";
import {createResponseService} from "./service-utils/functions/create-response-service";
import {renameMongoIdPost} from "../../helpers/functions/posts-functions-helpers";
import {injectable} from "inversify";
import {LikeStatus} from "../../helpers/enums/like-status";
import {PostsQueryRepository} from "../../infrastructure/queryRepositories/posts-query-repository";
import {LikesInfoQueryRepository} from "../../infrastructure/queryRepositories/likes-info-query-repository";
import {LikesInfoService} from "./likes-info-service";
import {UsersQueryRepository} from "../../infrastructure/queryRepositories/users-query-repository";
import {reformNewestLikes} from "../../infrastructure/queryRepositories/utils/likes-info-functions";
import {PostDBType} from "../../domain/db-types/posts-db-types";
import {PostModel} from "../../domain/posts-schema-model";


@injectable()
export class PostsService {

    constructor(protected postsRepository: PostsRepository,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository,
                protected usersQueryRepository: UsersQueryRepository,
                protected likesInfoQueryRepository: LikesInfoQueryRepository,
                protected likesInfoService: LikesInfoService) {
    }

    async createPost(bodyPost: BodyPostType): Promise<ResponseTypeService> {

        const blog = await this.blogsQueryRepository.getBlogById(bodyPost.blogId);
        if (!blog) {
            return createResponseService(400, {
                errorsMessages: [{
                    message: "Such blogId is not found",
                    field: "blogId"
                }]
            })
        }

        const post = PostModel.makeInstance(bodyPost, blog.name);


        await this.postsRepository.createPost(post);

        //find last 3 Likes
        const newestLikes = await this.likesInfoQueryRepository.getNewestLikesOfPost(post._id);
        const reformedNewestLikes = reformNewestLikes(newestLikes);

        const postMapped = renameMongoIdPost(post, reformedNewestLikes, 'None');

        return createResponseService(201, postMapped)
    }

    async createPostByBlogId(blogId: string, body: BodyPostByBlogIdType): Promise<null | PostTypeWithId> {
        //checking the existence of a blog
        const blog = await this.blogsQueryRepository.getBlogById(blogId);
        if (!blog) {
            return null
        }

        const post = new PostDBType(
            new ObjectId(),
            body.title,
            body.shortDescription,
            body.content,
            blogId,
            blog.name,
            new Date().toISOString(),
            {
                likesCount: 0,
                dislikesCount: 0
            }
        )

        await this.postsRepository.createPostByBlogId(post);

        //find last 3 Likes
        const newestLikes = await this.likesInfoQueryRepository.getNewestLikesOfPost(post._id);
        const reformedNewestLikes = reformNewestLikes(newestLikes);

        return renameMongoIdPost(post, reformedNewestLikes, 'None');
    }

    async updatePost(body: BodyPostType, id: string): Promise<ResponseTypeService> {

        const blog = await this.blogsQueryRepository.getBlogById(body.blogId);
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
        //check of existing LikeInfo
        const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByPostAndUser(new ObjectId(postId), userId);
        //если не существует, то у пользователя 'None'
        if (!likeInfo) {

            if (likeStatus === 'None') return true //Если статусы совпадают, то ничего не делаем
            //Иначе увеличиваем количество лайков/дизлайков
            const result = await this.postsRepository.incrementNumberOfLikesOfPost(postId, likeStatus);
            if (!result) {
                throw new Error('Incrementing number of likes failed');
            }
            //Создаем like info
            const user = await this.usersQueryRepository.getUserByUserId(userId);
            if (!user) {
                throw new Error('User with this userId is not found');
            }

            await this.likesInfoService.createLikeInfoPost(userId, new ObjectId(postId), user.login, likeStatus);

            return true;
        }

        //Если существует likeInfo, то:
        if (likeStatus === likeInfo.statusLike) return true //Если статусы совпадают, то ничего не делаем;

        //В ином случае меняем статус лайка
        const isUpdate = await this.likesInfoService.updateLikeInfoPost(userId, new ObjectId(postId), likeStatus);
        if (!isUpdate) {
            throw new Error('Like status of the post is not updated');
        }

        const result1 = await this.postsRepository.incrementNumberOfLikesOfPost(postId, likeStatus);
        if (!result1) {
            throw new Error('Incrementing number of likes failed');
        }
        //уменьшаю на 1 то что убрали
        const result2 = await this.postsRepository.decrementNumberOfLikesOfPost(postId, likeInfo.statusLike);
        if (!result2) {
            throw new Error('Decrementing number of likes failed');
        }

        return true;
    }

    async deleteSinglePost(id: string): Promise<boolean> {

        return await this.postsRepository.deleteSinglePost(id);
    }
}

