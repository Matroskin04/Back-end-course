import {blogsCollection, postsCollection} from "../db";
import {QueryBlogsModel} from "../models/BlogsModels/UriBlogModel";
import {renameMongoIdBlog} from "../domain/blogs-service";
import {blogPaginationType, postsOfBlogPaginationType, variablesForReturnType} from "./types-blogs-query-repository";
import {renameMongoIdPost} from "../domain/posts-service";
import {blogType} from "../repositories/types-blogs-repositories";
import {ObjectId} from "mongodb";
import {variablesForReturnPost} from "./posts-query-repository";


async function variablesForReturnBlog(query: QueryBlogsModel | null = null): Promise<variablesForReturnType> {
    const variables: variablesForReturnType = {
        pageNumber: query?.pageNumber ?? 1,
        pageSize: query?.pageSize ?? 10,
        sortBy: query?.sortBy ?? "createdAt",
        sortDirection: query?.sortDirection === 'asc' ? 1 : -1,
        totalCount: await blogsCollection.count()
    }
    variables.paramSort = {[variables.sortBy]: variables.sortDirection}; //TODO типизация

    return variables
}

export const blogsQueryRepository = {

    async getAllBlogs(query: QueryBlogsModel | null = null): Promise<blogPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ? query.searchNameTerm : null;
        const paramsOfElems = await variablesForReturnBlog(query);
        const countAllBlogsSort = await postsCollection
            .find({name: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .count();

        const allBlogsOnPages = await blogsCollection
            .find({name: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        return {
            pagesCount:  Math.ceil(countAllBlogsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllBlogsSort,
            items: allBlogsOnPages.map(p => renameMongoIdBlog(p))
        }
    },

    async getPostsOfBlog(blogId: string, query: QueryBlogsModel | null = null): Promise<null | postsOfBlogPaginationType> {

        const paramsOfElems = await variablesForReturnPost(query);
        const countAllPostsSort = await postsCollection.find({blogId: blogId}).count(); //TODO Вынести в variable

        const allPostsOnPages = await postsCollection
            .find({blogId: blogId})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).toArray();

        if ( allPostsOnPages.length === 0 ) return null

        return {
            pagesCount:  Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllPostsSort,
            items: allPostsOnPages.map(p => renameMongoIdPost(p))
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