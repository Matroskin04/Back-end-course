import {allErrors, allVideos, arrErrors} from "../index";
import {bodyType, videoType} from "../types";
import {checkError, createdAt, publicationDate} from "../routes/videos-routes";

export const videosRepositories = {
    createVideo(body: bodyType) {
        checkError(body);
        if (arrErrors.length > 0) {
            return allErrors
        } else {
            const newVideo: videoType = {
                "id": allVideos.at(-1) ? allVideos.at(-1)!.id + 1 : 0,
                "title": body.title!,
                "author": body.author!,
                "canBeDownloaded": body.canBeDownloaded ?? false,
                "minAgeRestriction": body.minAgeRestriction ?? null,
                "createdAt": createdAt,
                "publicationDate": publicationDate,
                "availableResolutions": body.availableResolutions!
            };
            allVideos.push(newVideo);
            return newVideo
        }
    }
}