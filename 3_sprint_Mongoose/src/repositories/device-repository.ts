import {DeviceModel, DeviceSchema} from "../db/shemasModelsMongoose/devices-shema-model";
import {DeviceDBType} from "../types/db-types";

export const deviceRepository = {

    async createNewDevice(infoDevice: DeviceDBType): Promise<void> {

        // await DeviceSchema.index( { lastActiveDate: 1 }, { expireAfterSeconds: infoDevice.expirationDate } ); // todo чистка девайсов через индексы? Сделать
        await DeviceModel.create(infoDevice);
        return;
    },

    async deleteDevicesExcludeCurrent(deviceId: string): Promise<boolean> {

        const result = await DeviceModel.deleteMany({deviceId: {$ne: deviceId}});
        return result.deletedCount > 0;
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {

        const result = await DeviceModel.deleteOne({deviceId});
        return result.deletedCount === 1;
    },

    async updateLastActiveDate(deviceId: string, newDate: string): Promise<boolean> {

        const result = await DeviceModel.updateOne({deviceId}, {$set: {lastActiveDate: newDate} });
        return result.modifiedCount === 1;
    }
}