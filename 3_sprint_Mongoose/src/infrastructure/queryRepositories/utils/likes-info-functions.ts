import {NewestLikesType} from "../../repositories/repositories-types/posts-types-repositories";

export function reformNewestLikes(newestLikes: NewestLikesType) {

    const reformedNewestLikes = []

    for (let i of newestLikes) {
        reformedNewestLikes.push({
            userId: i.userId,
            login: i.login,
            addedAt: i.addedAt
        })
    }

    return reformedNewestLikes;
}