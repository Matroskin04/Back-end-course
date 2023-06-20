import {InfoRequestDBType} from "../types/types";
import {InfoRequestModel} from "../db/shemasModelsMongoose/info-requests-shema-model";

export const infoRequestRepository = {

    async saveInfoRequest(infoRequest: InfoRequestDBType): Promise<void> {

        // await InfoRequestModel.ensureIndexes( { date: 1 }, { expireAfterSeconds: 10 } ); // todo автоудаление сделать
        await InfoRequestModel.create(infoRequest);
        return;
    }
}