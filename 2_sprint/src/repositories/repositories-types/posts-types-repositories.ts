export type PostType = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
    createdAt: string
}

export type PostTypeWithId = PostType & {id:	string}

export type BodyPostType = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
}

export type BodyPostByBlogIdType = {
    title:	string
    shortDescription:	string
    content:	string
}

