export type QueryUserModel = {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: string | number;
  pageSize?: string | number;
};
