import {
    BodyPostType,
    PostTypeWithId
} from "../repositories/repositories-types/posts-types-repositories";
import {postsRepository} from "../repositories/posts-repository";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ObjectId} from "mongodb";
import {
    CommentOutputType,
} from "../repositories/repositories-types/comments-types-repositories";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {mappingComment} from "./comments-service";
import {postsCollection} from "../db";
import {CommentDBType, PostDBType} from "../types/types";

export function renameMongoIdPost(post: any
): PostTypeWithId {
    return {
        id:	post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId:	post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsService = {

    async createPost(body: BodyPostType): Promise<PostTypeWithId> {

        const blogName = await blogsQueryRepository.getSingleBlog(body.blogId);

        const post: PostDBType = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName!.name,
            createdAt: new Date().toISOString()
        };
        await postsRepository.createPost(post);
        return renameMongoIdPost(post)
    },

    async updatePost(body: BodyPostType, id: string): Promise<boolean> {

        return await postsRepository.updatePost(body, id);
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        return await postsRepository.deleteSinglePost(id);
    },

    async createCommentByPostId(body: CreateCommentByPostIdModel, userId: ObjectId, postId: string): Promise<null | CommentOutputType> {

        const user = await usersQueryRepository.getUserByUserId(userId)
        if (!user) {
            return null;
        }

        const post = await postsCollection.findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null;
        }

        const comment: CommentDBType = {
            _id: new ObjectId(),
            content: body.content,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }

        await postsRepository.createCommentByPostId(comment);
        return mappingComment(comment);
    }
}