import {BlogTypeWithId} from "../../repositories/repositories-types/blogs-types-repositories";

export function renameMongoIdBlog(blog: any
): BlogTypeWithId {
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}