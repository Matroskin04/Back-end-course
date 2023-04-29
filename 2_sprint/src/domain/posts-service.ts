import {bodyPostType, postType} from "../repositories/types-posts-repositories";
import {postsRepositories} from "../repositories/posts-repositories";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {CreateCommentByPostIdModel} from "../models/CommentsModels/CreateCommentModel";
import {ObjectId} from "mongodb";
import {commentOutputType, commentType} from "../repositories/types-comments-repositories";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {mappingComment} from "./comments-service";
import {postsCollection} from "../db";

export function renameMongoIdPost(post: any
): postType {
    post.id = post._id;
    delete post._id;
    return post;
}

export const postsService = {

    async createPost(body: bodyPostType): Promise<postType> {

        const blogName = await blogsQueryRepository.getSingleBlog(body.blogId);

        const post: postType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogName!.name,
            createdAt: new Date().toISOString()
        };
        await postsRepositories.createPost(post);
        return renameMongoIdPost(post)
    },

    async createCommentByPostId(body: CreateCommentByPostIdModel, userId: ObjectId, postId: string): Promise<null | commentOutputType> {

        const user = await usersQueryRepository.getUserByUserId(userId)
        if (!user) { // todo Нужно ли делать проверку
            return null;
        }

        const post = await postsCollection.findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null;
        }

        const comment: commentType = {
            content: body.content,
            commentatorInfo: {
                userId: userId.toString(),
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            postId: postId
        }

        await postsRepositories.createCommentByPostId(comment); // todo создавать в post или коммент
        return mappingComment(comment);
    },

    async updatePost(body: bodyPostType, id: string): Promise<boolean> {

        return await postsRepositories.updatePost(body, id);
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        return await postsRepositories.deleteSinglePost(id);
    }
}