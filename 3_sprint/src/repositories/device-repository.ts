import {devicesCollection} from "../db";
import {DeviceDBType} from "../types/types";

export const deviceRepository = {

    async createNewDevice(infoDevice: DeviceDBType): Promise<void> {

        // await devicesCollection.dropIndex('lastActiveDate_1');
        // await devicesCollection.createIndex( { lastActiveDate: 1 }, { expireAfterSeconds: infoDevice.expirationDate } ); // todo чистка девайсов через индексы? Сделать
        await devicesCollection.insertOne(infoDevice);
        return;
    },

    async deleteDevicesExcludeCurrent(deviceId: string): Promise<void> {

        await devicesCollection.deleteMany({deviceId: {$ne: deviceId}});
        return;
    },

    async deleteDeviceById(deviceId: string): Promise<boolean> {

        const result = await devicesCollection.deleteOne({deviceId});
        return result.deletedCount > 0;
    },

    async updateLastActiveDate(deviceId: string, newDate: string): Promise<boolean> {

        const result = await devicesCollection.updateOne({deviceId}, {$set: {lastActiveDate: newDate} });
        return result.modifiedCount > 0;
    }
}