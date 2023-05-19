export type UriPostModel = {
    id: string
}
export type QueryPostsModel = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: string
    pageNumber?: string | number
    pageSize?: string | number
}