import {infoRequestCollection} from "../db";
import {InfoRequestDBType} from "../types/types";

export const infoRequestRepository = {

    async saveInfoRequest(infoRequest: InfoRequestDBType): Promise<void> {

        await infoRequestCollection.createIndex( { date: 1 }, { expireAfterSeconds: 10 } ); // todo автоудаление - нормальный вариант?
        await infoRequestCollection.insertOne(infoRequest);
        return;
    }
}