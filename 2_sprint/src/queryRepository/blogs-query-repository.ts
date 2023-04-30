import {blogsCollection, postsCollection} from "../db";
import {renameMongoIdBlog} from "../domain/blogs-service";
import {BlogPaginationType, PostsOfBlogPaginationType} from "./query-repository-types/blogs-types-query-repository";
import {renameMongoIdPost} from "../domain/posts-service";
import {BlogType} from "../repositories/repositories-types/blogs-types-repositories";
import {ObjectId} from "mongodb";
import {QueryBlogModel} from "../models/BlogsModels/QueryBlogModel";
import {variablesForReturn} from "./utils/variables-for-return";


export const blogsQueryRepository = {

    async getAllBlogs(query: QueryBlogModel | null = null): Promise<BlogPaginationType> { // todo если query не отправляется, то его значение null?

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

    async getPostsOfBlog(blogId: string, query: QueryBlogModel | null = null): Promise<null | PostsOfBlogPaginationType> {

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

    async getSingleBlog(id: string): Promise<null | BlogType> {

        const singleBlog = await blogsCollection.findOne({_id: new ObjectId(id)});

        if (singleBlog) {
            return renameMongoIdBlog(singleBlog);
        }
        return null;
    }
}