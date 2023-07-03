import {infoRequestRepository} from "../repositories/info-request-repository";
import {InfoRequestDBType} from "../types/db-types";

export const infoRequestService = {

    async saveInfoRequest(infoRequest: InfoRequestDBType): Promise<void> {

        await infoRequestRepository.saveInfoRequest(infoRequest);
        return;
    }
}