import {DevicesRepository} from "../../infrastructure/repositories/devices-repository";
import {ObjectId} from "mongodb";
import {ResponseTypeService} from "./service-types/responses-types-service";
import {createResponseService} from "./service-utils/functions/create-response-service";
import {DeviceDBType} from "../../types/db-types";
import {DevicesQueryRepository} from "../../infrastructure/queryRepository/devices-query-repository";
import {JwtQueryRepository} from "../../infrastructure/queryRepository/jwt-query-repository";
import { injectable } from "inversify";


@injectable()
export class DevicesService {

    constructor(protected jwtQueryRepository: JwtQueryRepository,
                protected devicesQueryRepository: DevicesQueryRepository,
                protected deviceRepository: DevicesRepository) {
    }

    async createNewDevice(ip: string, title: string, userId: ObjectId, refreshToken: string): Promise<void> {

        const payloadToken = this.jwtQueryRepository.getPayloadToken(refreshToken);
        if(!payloadToken) {
            throw new Error('Refresh token is invalid.')
        }

        const infoDevice = new DeviceDBType(
            new ObjectId(),
            ip,
            title,
            new Date(payloadToken.iat! * 1000).toISOString(),
            payloadToken.deviceId,
            userId.toString(),
            payloadToken.exp! - payloadToken.iat!
        )

        await this.deviceRepository.createNewDevice(infoDevice);
        return;
    }

    async deleteDevicesExcludeCurrent(refreshToken: string): Promise<void | false> {

        const payloadToken = this.jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadToken) {
            throw new Error('Refresh is invalid');
        }

        const result = await this.deviceRepository.deleteDevicesExcludeCurrent(payloadToken.deviceId);
        if (!result) {
            throw new Error('Deletion failed');
        }

        return;
    }

    async deleteDeviceById(deviceId: string, userId: string): Promise<ResponseTypeService> {

        const device = await this.devicesQueryRepository.getDeviceById(deviceId);

        if (!device) return createResponseService(404, 'The device is not found');
        if (device.userId !== userId) return createResponseService(403, 'You can\'t delete not your own device');

        const result = await this.deviceRepository.deleteDeviceById(deviceId);
        if (!result) {
            throw new Error('The device is not found')
        }

        return createResponseService(204, 'Successfully deleted');
    }

    async deleteDeviceByRefreshToken(refreshToken: string): Promise<boolean> {

        const payloadToken = this.jwtQueryRepository.getPayloadToken(refreshToken);
        if (!payloadToken) {
            throw new Error('Refresh is invalid');
        }

        return await this.deviceRepository.deleteDeviceById(payloadToken.deviceId);
    }

    async updateLastActiveDate(deviceId: string, newDateNum: number): Promise<boolean> {

        const newDateISOS = new Date(newDateNum * 1000).toISOString()
        return await this.deviceRepository.updateLastActiveDate(deviceId, newDateISOS);
    }
}
