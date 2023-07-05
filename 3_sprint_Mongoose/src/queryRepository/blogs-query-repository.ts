import {BlogPaginationType} from "./query-repository-types/blogs-types-query-repository";
import {BlogTypeWithId} from "../repositories/repositories-types/blogs-types-repositories";
import {ObjectId} from "mongodb";
import {QueryBlogModel} from "../models/BlogsModels/QueryBlogModel";
import {variablesForReturn} from "./utils/variables-for-return";
import {BlogModel} from "../db/shemasModelsMongoose/blogs-shema-model";
import {renameMongoIdBlog} from "../helpers/functions/blogs-functions-helpers";


export class BlogsQueryRepository {

    async getAllBlogs(query: QueryBlogModel): Promise<BlogPaginationType> { //

        const searchNameTerm: string | null = query?.searchNameTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);


        const countAllBlogsSort = await BlogModel
            .countDocuments({name: {$regex: searchNameTerm ?? '', $options: 'i'} });

        const allBlogsOnPages = await BlogModel
            .find({name: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        return {
            pagesCount:  Math.ceil(countAllBlogsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllBlogsSort,
            items: allBlogsOnPages.map(p => renameMongoIdBlog(p))
        }
    }

    async getSingleBlog(id: string): Promise<null | BlogTypeWithId> {

        const singleBlog = await BlogModel.findOne({_id: new ObjectId(id)});

        if (singleBlog) {
            return renameMongoIdBlog(singleBlog);
        }
        return null;
    }
}