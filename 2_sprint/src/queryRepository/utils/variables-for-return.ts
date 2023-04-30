import {QueryBlogModel} from "../../models/BlogsModels/QueryBlogModel";
import {VariablesForReturnType} from "../query-repository-types/general-types-repositories";

export async function variablesForReturn(query: QueryBlogModel | null = null): Promise<VariablesForReturnType> {

    const pageNumber = query?.pageNumber ?? 1;
    const pageSize = query?.pageSize ?? 10;
    const sortBy = query?.sortBy ?? "createdAt";
    const sortDirection = query?.sortDirection === 'asc' ? 1 : -1;
    const paramSort = {[sortBy]: sortDirection};

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        paramSort
    }
}