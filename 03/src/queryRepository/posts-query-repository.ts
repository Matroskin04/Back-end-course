import {postPaginationType} from "./types-posts-query-repository";
import {QueryPostsModel} from "../models/PostsModels/UriPostModel";
import {postsCollection} from "../db";
import {variablesForReturnType} from "./types-blogs-query-repository";
import {renameMongoIdPost} from "../domain/posts-service";
import {postType} from "../repositories/types-posts-repositories";
import {ObjectId} from "mongodb";

export async function variablesForReturnPost(query: QueryPostsModel | null = null): Promise<variablesForReturnType> { //TODO Вынести общую для post and blog?
    const variables: variablesForReturnType = {
        pageNumber: query?.pageNumber ?? 1,
        pageSize: query?.pageSize ?? 10,
        sortBy: query?.sortBy ?? "createdAt",
        sortDirection: query?.sortDirection === 'asc' ? 1 : -1,
        totalCount: await postsCollection.count()
    }
    variables.paramSort = {[variables.sortBy]: variables.sortDirection}; //TODO типизация

    return variables
}

export const postsQueryRepository = {

    async getAllPosts(query: QueryPostsModel | null = null): Promise<postPaginationType> {
        const searchNameTerm: string | null = query?.searchNameTerm ? query.searchNameTerm : null;
        const paramsOfElems = await variablesForReturnPost(query);
        const countAllPostsSort = await postsCollection
            .find({title: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .count();


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