import {deviceRepository} from "../repositories/device-repository";
import {ObjectId} from "mongodb";
import {jwtQueryRepository} from "../queryRepository/jwt-query-repository";
import {devicesQueryRepository} from "../queryRepository/devices-query-repository";
import {ResponseTypeService} from "./service-types/responses-types-service";
import {createResponseService} from "./service-utils/functions/create-response-service";
import {DeviceDBType} from "../types/db-types";


class DevicesService {

    async createNewDevice(ip: string, title: string, userId: ObjectId, refreshToken: string): Promise<void> {

        const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
        if(!payloadToken) {
            throw new Error('Refresh token is invalid.')
        }

        const infoDevice: DeviceDBType = {
            _id: new ObjectId(),
            ip,
            title,
            deviceId: payloadToken.deviceId,
            lastActiveDate: new Date(payloadToken.iat! * 1000).toISOString(),
            userId: userId.toString(),
            expirationDate: payloadToken.exp! - payloadToken.iat!
        }

        await deviceRepository.createNewDevice(infoDevice);
        return;
    }

    async deleteDevicesExcludeCurrent(refreshToken: string): Promise<void | false> {

        const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadToken) {
            throw new Error('Refresh is invalid');
        }

        const result = await deviceRepository.deleteDevicesExcludeCurrent(payloadToken.deviceId);
        if (!result) {
            throw new Error('Deletion failed');
        }

        return;
    }

    async deleteDeviceById(deviceId: string, userId: string): Promise<ResponseTypeService> {

        const device = await devicesQueryRepository.getDeviceById(deviceId);

        if (!device) return createResponseService(404, 'The device is not found');
        if (device.userId !== userId) return createResponseService(403, 'You can\'t delete not your own device');

        const result = await deviceRepository.deleteDeviceById(deviceId);
        if (!result) {
            throw new Error('The device is not found')
        }

        return createResponseService(204, 'Successfully deleted');
    }

    async deleteDeviceByRefreshToken(refreshToken: string): Promise<boolean> {

        const payloadToken = jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadToken) {
            throw new Error('Refresh is invalid');
        }

        return await deviceRepository.deleteDeviceById(payloadToken.deviceId);
    }

    async updateLastActiveDate(deviceId: string, newDateNum: number): Promise<boolean> {

        const newDateISOS = new Date(newDateNum * 1000).toISOString()
        return await deviceRepository.updateLastActiveDate(deviceId, newDateISOS);
    }
}
export const devicesService = new DevicesService();