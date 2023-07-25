import {BlogPaginationType} from "./query-repository-types/blogs-types-query-repository";
import {BlogTypeWithId} from "../repositories/repositories-types/blogs-types-repositories";
import {ObjectId} from "mongodb";
import {QueryBlogModel} from "../../models/BlogsModels/QueryBlogModel";
import {variablesForReturn} from "./utils/variables-for-return";
import {BlogModel} from "../../domain/blogs-schema-model";
import { injectable } from "inversify";


@injectable()
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
            .sort(paramsOfElems.paramSort);

        return {
            pagesCount:  Math.ceil(countAllBlogsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllBlogsSort,
            items: allBlogsOnPages.map(p => p.renameIntoViewModel())
        }
    }

    async getBlogById(id: string): Promise<null | BlogTypeWithId> {

        const blog = await BlogModel.findOne({_id: new ObjectId(id)});

        if (blog) {
            return blog.renameIntoViewModel();
        }
        return null;
    }
}