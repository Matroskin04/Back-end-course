import {PostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {PostTypeWithId} from "../repositories/repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {QueryPostModel} from "../../models/PostsModels/QueryPostModel";
import {variablesForReturn} from "./utils/variables-for-return";
import {QueryBlogModel} from "../../models/BlogsModels/QueryBlogModel";
import {PostsOfBlogPaginationType} from "./query-repository-types/blogs-types-query-repository";
import {PostModel} from "../../db/shemasModelsMongoose/posts-schema-model";
import {renameMongoIdPost} from "../../helpers/functions/posts-functions-helpers";
import { injectable } from "inversify";


@injectable()
export class PostsQueryRepository {

    async getAllPosts(query: QueryPostModel): Promise<PostPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllPostsSort = await PostModel
            .countDocuments({title: {$regex: searchNameTerm ?? '', $options: 'i'} });


        const allPostsOnPages = await PostModel
            .find({title: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        return {
            pagesCount:  Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllPostsSort,
            items: allPostsOnPages.map(p => renameMongoIdPost(p))
        }
    }

    async getPostsOfBlog(blogId: string, query: QueryBlogModel): Promise<null | PostsOfBlogPaginationType> {

        const paramsOfElems = await variablesForReturn(query);
        const countAllPostsSort = await PostModel.countDocuments({blogId: blogId});

        const allPostsOnPages = await PostModel
            .find({blogId: blogId})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        if ( allPostsOnPages.length === 0 ) return null

        return {
            pagesCount:  Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllPostsSort,
            items: allPostsOnPages.map(p => renameMongoIdPost(p))
        }
    }

    async getSinglePost(id: string): Promise<null | PostTypeWithId> {

        const singlePost = await PostModel.findOne({_id: new ObjectId(id)});

        if (!singlePost) {
            return null;
        }
        return renameMongoIdPost(singlePost);
    }
}
