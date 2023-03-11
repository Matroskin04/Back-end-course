export type blog = {
    id: string
    name: string
    description: string
    websiteUrl: string
}

export type bodyBlogType = {
    name: string
    description: string
    websiteUrl: string
}

export type errorsMessagesType = Array<{
    "message": string
    "field": string
}>

export type postType = {
    id:	string
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
    blogName:	string
}

export type bodyPostType = {
    title:	string
    shortDescription:	string
    content:	string
    blogId:	string
}