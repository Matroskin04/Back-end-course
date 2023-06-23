import {PostTypeWithId} from "../../repositories/repositories-types/posts-types-repositories";

export function renameMongoIdPost(post: any
): PostTypeWithId {
    return {
        id:	post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId:	post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}