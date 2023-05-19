import {postPaginationType} from "./types-posts-query-repository";
import {QueryPostsModel} from "../models/PostsModels/UriPostModel";
import {postsCollection} from "../db";
import {renameMongoIdPost} from "../domain/posts-service";
import {postType} from "../repositories/types-posts-repositories";
import {ObjectId} from "mongodb";
import {variablesForReturn} from "./blogs-query-repository";

export const postsQueryRepository = {

    async getAllPosts(query: QueryPostsModel | null = null): Promise<postPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ? query.searchNameTerm : null;
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

    async getSinglePost(id: string): Promise<null | postType> {

        const singlePost = await postsCollection.findOne({_id: new ObjectId(id)});

        if (singlePost) {
            return renameMongoIdPost(singlePost);
        }
        return null;
    }
}