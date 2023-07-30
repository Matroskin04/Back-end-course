import { UserViewType } from '../../infrastructure/repository/users-types-repositories';

export type ViewUserModel = UserViewType;

export type ViewAllUsersModels = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserViewType>;
};
