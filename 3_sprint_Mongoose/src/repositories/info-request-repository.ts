import {InfoRequestModel} from "../db/shemasModelsMongoose/info-requests-shema-model";
import {InfoRequestDBType} from "../types/db-types";

export const infoRequestRepository = {

    async saveInfoRequest(infoRequest: InfoRequestDBType): Promise<void> {

        // await InfoRequestModel.ensureIndexes( { date: 1 }, { expireAfterSeconds: 10 } ); // todo автоудаление сделать
        await InfoRequestModel.create(infoRequest);
        return;
    }
}