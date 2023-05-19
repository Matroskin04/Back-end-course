import {InfoRequestDBType} from "../types/types";
import {infoRequestRepository} from "../repositories/info-request-repository";

export const infoRequestService = {

    async saveInfoRequest(infoRequest: InfoRequestDBType): Promise<void> {

        await infoRequestRepository.saveInfoRequest(infoRequest);
        return;
    }
}