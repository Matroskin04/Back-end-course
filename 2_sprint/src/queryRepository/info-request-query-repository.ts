import {infoRequestCollection} from "../db";
import {InfoRequestDBType} from "../types/types";
import {InfoRequestFilterType} from "./query-repository-types/info-request-types-query-repository";

export const infoRequestQueryRepository = {

    async getInfoRequestsByFilter(requestFilterFilter: InfoRequestFilterType): Promise<InfoRequestDBType[]> {

        const result = await infoRequestCollection.find({IP: requestFilterFilter.IP, URL: requestFilterFilter.URL, date: {$gte: requestFilterFilter.date10SecsAgo}});
        return result.toArray();
    }
}