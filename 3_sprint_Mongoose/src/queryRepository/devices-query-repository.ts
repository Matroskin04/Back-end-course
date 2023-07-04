import {DeviceOutputType} from "../repositories/repositories-types/devices-types-repositories";
import {DeviceModel} from "../db/shemasModelsMongoose/devices-shema-model";
import {DeviceDBType} from "../types/db-types";


class DevicesQueryRepository {

    async getAllDevicesByUserId(userId: string): Promise<DeviceOutputType[]> {

        return DeviceModel.find({userId}, {_id: 0, userId: 0, expirationDate: 0, __v: 0} ).lean();
    }

    async getDeviceById(deviceId: string): Promise<DeviceDBType | null> {

        return DeviceModel.findOne({deviceId});
    }
}
export const devicesQueryRepository = new DevicesQueryRepository();