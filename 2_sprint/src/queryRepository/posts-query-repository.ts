import {CommentOfPostPaginationType, PostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {commentsCollection, postsCollection} from "../db";
import {renameMongoIdPost} from "../domain/posts-service";
import {PostType} from "../repositories/repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {mappingComment} from "../domain/comments-service";
import {QueryPostModel} from "../models/PostsModels/QueryPostModel";
import {variablesForReturn} from "./utils/variables-for-return";

export const postsQueryRepository = {

    async getAllPosts(query: QueryPostModel | null = null): Promise<PostPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllPostsSort = await postsCollection
            .countDocuments({title: {$regex: searchNameTerm ?? '', $options: 'i'} });


        const allPostsOnPages = await postsCollection
            .find({title: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        return {
            pagesCount:  Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllPostsSort,
            items: allPostsOnPages.map(p => renameMongoIdPost(p))
        }
    },

    async getSinglePost(id: string): Promise<null | PostType> {

        const singlePost = await postsCollection.findOne({_id: new ObjectId(id)});

        if (singlePost) {
            return renameMongoIdPost(singlePost);
        }
        return null;
    },

    async getCommentOfPost(query: QueryPostModel | null = null, id: string): Promise<CommentOfPostPaginationType | null> {

        const post = await this.getSinglePost(id);
        if (!post) {
            return null
        }

        const paramsOfElems = await variablesForReturn(query);

        const countAllCommentsOfPost = await commentsCollection
            .countDocuments({postId: id});


        const allCommentOfPostsOnPages = await commentsCollection
            .find({postId: id})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        return {
            pagesCount:  Math.ceil(countAllCommentsOfPost / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllCommentsOfPost,
            items: allCommentOfPostsOnPages.map(p => mappingComment(p))
        }
    }
}