import {
    NewestLikesType,
    PostTypeWithId,
    PostViewType
} from "../../infrastructure/repositories/repositories-types/posts-types-repositories";


export function renameMongoIdPost(post: any, newestLikes: NewestLikesType, myStatus: 'None' | 'Like' | 'Dislike'): PostViewType {
    return {
        id:	post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId:	post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus,
            newestLikes
        }
    }
}