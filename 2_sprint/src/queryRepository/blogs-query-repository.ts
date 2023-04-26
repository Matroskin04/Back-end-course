import {blogsCollection, postsCollection} from "../db";
import {renameMongoIdBlog} from "../domain/blogs-service";
import {blogPaginationType, postsOfBlogPaginationType, variablesForReturnType} from "./types-blogs-query-repository";
import {renameMongoIdPost} from "../domain/posts-service";
import {blogType} from "../repositories/types-blogs-repositories";
import {ObjectId} from "mongodb";
import {QueryModel} from "../models/UriModels";

export async function variablesForReturn(query: QueryModel | null = null): Promise<variablesForReturnType> {

    const pageNumber = query?.pageNumber ?? 1;
    const pageSize = query?.pageSize ?? 10;
    const sortBy = query?.sortBy ?? "createdAt";
    const sortDirection = query?.sortDirection === 'asc' ? 1 : -1;
    const totalCount = await blogsCollection.countDocuments();
    const paramSort = {[sortBy]: sortDirection};

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        totalCount,
        paramSort
    }
}

export const blogsQueryRepository = {

    async getAllBlogs(query: QueryModel | null = null): Promise<blogPaginationType> { // todo если query не отправляется, то его значение null?

        const searchNameTerm: string | null = query?.searchNameTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllBlogsSort = await blogsCollection
            .countDocuments({name: {$regex: searchNameTerm ?? '', $options: 'i'} });

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

    async getPostsOfBlog(blogId: string, query: QueryModel | null = null): Promise<null | postsOfBlogPaginationType> {

        const paramsOfElems = await variablesForReturn(query);
        const countAllPostsSort = await postsCollection.countDocuments({blogId: blogId});

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