export type videoType = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": number | null,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": Array<string>
};
export type bodyType = {
    "id"?: number,
    "title"?: string,
    "author"?: string,
    "canBeDownloaded"?: boolean,
    "minAgeRestriction"?: any,
    "createdAt"?: string,
    "publicationDate"?: string,
    "availableResolutions"?: Array<string>
};
export type allVideosType = Array<videoType>;
export type errorObjType = { message: string, field: string };
export type errorType = { errorsMessages: Array<errorObjType> };