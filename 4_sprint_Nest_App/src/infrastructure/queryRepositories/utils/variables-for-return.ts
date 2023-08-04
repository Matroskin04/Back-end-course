import { QueryBlogModel } from '../../../features/blogs/api/models/QueryBlogModel';
import { VariablesForReturnType } from '../query-repository-types/general-types-repositories';

export async function variablesForReturn(
  query: QueryBlogModel,
): Promise<VariablesForReturnType> {
  const pageNumber = query?.pageNumber ?? 1;
  const pageSize = query?.pageSize ?? 10;
  const sortBy = query?.sortBy ?? '_id'; //'createdAt';
  const sortDirection = query?.sortDirection === 'asc' ? 1 : -1;
  const paramSort = { [sortBy]: sortDirection };

  return {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    paramSort,
  };
}
