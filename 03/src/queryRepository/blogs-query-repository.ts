import {blogsCollection, postsCollection} from "../db";
import {QueryBlogsModel} from "../models/BlogsModels/UriBlogModel";
import {renameMongoIdBlog} from "../domain/blogs-service";
import {blogPaginationType, postsOfBlogPaginationType, variablesForReturnType} from "./types-blogs-query-repository";
import {renameMongoIdPost} from "../domain/posts-service";
import {blogType} from "../repositories/types-blogs-repositories";
import {ObjectId} from "mongodb";


async function variablesForReturn(query: QueryBlogsModel | null = null): Promise<variablesForReturnType> {
    const variables: variablesForReturnType = {
        pageNumber: query?.pageNumber ?? 1,
        pageSize: query?.pageSize ?? 10,
        sortBy: query?.sortBy ?? "createdAt",
        sortDirection: query?.sortDirection === 'asc' ? 1 : -1,
        totalCount: await blogsCollection.count()
    }
    variables.paramSort = {[variables.sortBy]: variables.sortDirection}; //TODO типизация
    variables.pagesCount = Math.ceil(+variables.totalCount / +variables.pageSize);

    return variables
}

export const blogsQueryRepository = {

    async getAllBlogs(query: QueryBlogsModel | null = null): Promise<blogPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ? query.searchNameTerm : null;
        const paramsOfElems = await variablesForReturn(query);

        const allBlogs = await blogsCollection
            .find({name: {$regex: searchNameTerm ?? ''} })
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        return {
            pagesCount: +paramsOfElems.pagesCount!,  //TODO Убрать воскл. знак
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: +paramsOfElems.totalCount,
            items: allBlogs.map(p => renameMongoIdBlog(p))
        }
    },

    async getPostsOfBlog(blogId: string, query: QueryBlogsModel | null = null): Promise<null | postsOfBlogPaginationType> {

        const paramsOfElems = await variablesForReturn(query)

        const allPosts = await postsCollection
            .find({blogId: blogId})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        if ( allPosts.length === 0 ) return null

        return {
            pagesCount: +paramsOfElems.pagesCount!, //TODO Воскл знак
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: +paramsOfElems.totalCount,
            items: allPosts.map(p => renameMongoIdPost(p))
        }
    },

    async getSingleBlog(id: string): Promise<null | blogType> {

        const singleBlog = await blogsCollection.findOne({_id: new ObjectId(id)});

        if (singleBlog) {
            return renameMongoIdBlog(singleBlog);
        }
        return null;
    }
}