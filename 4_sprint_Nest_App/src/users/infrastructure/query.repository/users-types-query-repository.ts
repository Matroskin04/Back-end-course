export type UsersPaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserViewType>;
};

export type UserViewType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type EmailAndLoginTerm = Array<{
  email?: { $regex: string; $options: string };
  login?: { $regex: string; $options: string };
}>;
