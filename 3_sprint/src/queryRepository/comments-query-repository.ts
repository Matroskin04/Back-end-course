import {commentsCollection} from "../db";
import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {mappingComment} from "../domain/comments-service";
import {ObjectId} from "mongodb";
import {QueryPostModel} from "../models/PostsModels/QueryPostModel";
import {CommentOfPostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {variablesForReturn} from "./utils/variables-for-return";
import {postsQueryRepository} from "./posts-query-repository";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<CommentOutputType | null> {

        const comment = await commentsCollection.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return null
        }
        return mappingComment(comment)
    },

    async getCommentOfPost(query: QueryPostModel, id: string): Promise<CommentOfPostPaginationType | null> {

        const post = await postsQueryRepository.getSinglePost(id);
        if (!post) {
            return null
        }

        const paramsOfElems = await variablesForReturn(query);

        const countAllCommentsOfPost = await commentsCollection
            .countDocuments({postId: id});


        const allCommentOfPostsOnPages = await commentsCollection
            .find({postId: id})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        return {
            pagesCount: Math.ceil(countAllCommentsOfPost / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllCommentsOfPost,
            items: allCommentOfPostsOnPages.map(p => mappingComment(p))
        }
    }
}