import {deviceRepository} from "../repositories/device-repository";
import {DeviceDBType} from "../types/types";
import {ObjectId} from "mongodb";
import {jwtQueryRepository} from "../queryRepository/jwt-query-repository";
import {devicesQueryRepository} from "../queryRepository/devices-query-repository";

export const devicesService = {

    async createNewDevice(ip: string, title: string, userId: ObjectId, refreshToken: string): Promise<void> {

        const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
        const infoDevice: DeviceDBType = {
            _id: new ObjectId(),
            ip,
            title,
            lastActiveDate: new Date(payloadToken!.iat!).toISOString(), //todo правильный рефакторинг
            deviceId: payloadToken!.deviceId,
            userId: userId.toString(),
            expirationDate: payloadToken!.exp! - payloadToken!.iat!
        }

        await deviceRepository.createNewDevice(infoDevice);
        return;
    },

    async deleteDevicesExcludeCurrent(refreshToken: string): Promise<void | false> {

        const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadToken) {
            throw new Error('Refresh is invalid');
        }
        await deviceRepository.deleteDevicesExcludeCurrent(payloadToken.deviceId);
        return;
    },

    async deleteDeviceById(deviceId: string, userId: string): Promise<number> {

        const device = await devicesQueryRepository.getDeviceById(deviceId);

        if (!device) return 404;
        if (device.userId !== userId) return 403;

        await deviceRepository.deleteDeviceById(deviceId);
        return 204;
    },

    async deleteDeviceByRefreshToken(refreshToken: string): Promise<boolean> {

        const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadToken) {
            throw new Error('Refresh is invalid');
        }
        return await deviceRepository.deleteDeviceById(payloadToken.deviceId);
    },

    async updateLastActiveDate(deviceId: string, newDateNum: number): Promise<boolean> {

        const newDateISOS = new Date(newDateNum).toISOString()
        return await deviceRepository.updateLastActiveDate(deviceId, newDateISOS);
    }
}