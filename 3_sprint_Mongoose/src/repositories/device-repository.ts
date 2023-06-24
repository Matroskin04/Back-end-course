import {DeviceDBType} from "../types/types";
import {DeviceModel} from "../db/shemasModelsMongoose/devices-shema-model";

export const deviceRepository = {

    async createNewDevice(infoDevice: DeviceDBType): Promise<void> {

        // await devicesCollection.dropIndex('lastActiveDate_1'); //todo без БД?
        // await devicesCollection.createIndex( { lastActiveDate: 1 }, { expireAfterSeconds: infoDevice.expirationDate } ); // todo чистка девайсов через индексы? Сделать
        await DeviceModel.create(infoDevice);
        return;
    },

    async deleteDevicesExcludeCurrent(deviceId: string): Promise<void> {

        await DeviceModel.deleteMany({deviceId: {$ne: deviceId}});
        return;
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