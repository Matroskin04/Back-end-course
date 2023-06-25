import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {ObjectId} from "mongodb";
import {QueryPostModel} from "../models/PostsModels/QueryPostModel";
import {CommentOfPostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {variablesForReturn} from "./utils/variables-for-return";
import {postsQueryRepository} from "./posts-query-repository";
import {CommentModel} from "../db/shemasModelsMongoose/comments-shema-model";
import {mappingComment} from "../helpers/functions/comments-functions-helpers";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<CommentOutputType | null> {

        const comment = await CommentModel.findOne({_id: new ObjectId(id)});
        if (!comment) {
            return null
        }

        return mappingComment(comment)
    },

    async getCommentsOfPost(query: QueryPostModel, id: string): Promise<CommentOfPostPaginationType | null> {

        const post = await postsQueryRepository.getSinglePost(id);
        if (!post) {
            return null
        }

        const paramsOfElems = await variablesForReturn(query);

        const countAllCommentsOfPost = await CommentModel
            .countDocuments({postId: id});


        const allCommentOfPostsOnPages = await CommentModel
            .find({postId: id})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        return {
            pagesCount: Math.ceil(countAllCommentsOfPost / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllCommentsOfPost,
            items: allCommentOfPostsOnPages.map(p => mappingComment(p))
        }
    }
}