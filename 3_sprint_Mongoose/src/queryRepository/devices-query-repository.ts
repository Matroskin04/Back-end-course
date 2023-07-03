import {DeviceOutputType} from "../repositories/repositories-types/devices-types-repositories";
import {DeviceModel} from "../db/shemasModelsMongoose/devices-shema-model";
import {DeviceDBType} from "../types/db-types";

export const devicesQueryRepository = {

    async getAllDevicesByUserId(userId: string): Promise<DeviceOutputType[]> {

        return DeviceModel.find({userId}, {projection: {_id: 0, userId: 0, expirationDate: 0} }).lean();
    },

    async getDeviceById(deviceId: string): Promise<DeviceDBType | null> {

        return DeviceModel.findOne({deviceId});
    }
}