import {
    BodyPostType,
    PostTypeWithId
} from "../repositories/repositories-types/posts-types-repositories";
import {postsRepository} from "../repositories/posts-repository";
import {blogsQueryRepository} from "../queryRepository/blogs-query-repository";
import {ObjectId} from "mongodb";
import {ResponseTypeService} from "./service-types/responses-types-service";
import {createResponseService} from "./service-utils/functions/create-response-service";
import {PostDBType} from "../types/db-types";

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

    async createPost(body: BodyPostType): Promise<ResponseTypeService> {

        const blog = await blogsQueryRepository.getSingleBlog(body.blogId);
        if (!blog) {
            return createResponseService(400, {errorsMessages: [{
                    message: "Such blogId is not found",
                    field: "blogId" }] })
        }

        const post: PostDBType = {
            _id: new ObjectId(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blog!.name,
            createdAt: new Date().toISOString()
        };

        await postsRepository.createPost(post);
        const postMapped = renameMongoIdPost(post);

        return createResponseService(201, postMapped)
    },

    async updatePost(body: BodyPostType, id: string): Promise<ResponseTypeService> {

        const blog = await blogsQueryRepository.getSingleBlog(body.blogId);
        if (!blog) {
            return createResponseService(400, {errorsMessages: [{
                    message: "Such blogId is not found",
                    field: "blogId" }] })
        }

        const result = await postsRepository.updatePost(body, id);
        if (!result) {
            return createResponseService(404, 'Not found');
        }
        return createResponseService(204, 'No content');
    },

    async deleteSinglePost(id: string): Promise<boolean> {

        return await postsRepository.deleteSinglePost(id);
    }
}