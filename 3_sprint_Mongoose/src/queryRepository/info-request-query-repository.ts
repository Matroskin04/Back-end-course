import {InfoRequestFilterType} from "./query-repository-types/info-request-types-query-repository";
import {InfoRequestModel} from "../db/shemasModelsMongoose/info-requests-shema-model";
import {InfoRequestDBType} from "../types/db-types";

export const infoRequestQueryRepository = {

    async getInfoRequestsByFilter(requestFilterFilter: InfoRequestFilterType): Promise<InfoRequestDBType[]> {

        return InfoRequestModel.find({IP: requestFilterFilter.IP, URL: requestFilterFilter.URL, date: {$gte: requestFilterFilter.date10SecsAgo}}).lean();
    }
}