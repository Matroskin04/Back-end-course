import {DeviceOutputType} from "../repositories/repositories-types/devices-types-repositories";
import {DeviceDBType} from "../types/types";
import {DeviceModel} from "../shemasModelsMongoose/devices-shema-model";

export const devicesQueryRepository = {

    async getAllDevicesByUserId(userId: string): Promise<DeviceOutputType[]> {

        return DeviceModel.find({userId}, {projection: {_id: 0, userId: 0, expirationDate: 0} }).lean();
    },

    async getDeviceById(deviceId: string): Promise<DeviceDBType | null> {

        return DeviceModel.findOne({deviceId});
    }
}