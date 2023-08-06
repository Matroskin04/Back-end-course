import { QueryBlogInputModel } from '../../../features/blogs/api/models/input/query-blog.input.model';
import { VariablesForReturnType } from './types/variables-for-return.types';

export async function variablesForReturn(
  query: QueryBlogInputModel,
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
