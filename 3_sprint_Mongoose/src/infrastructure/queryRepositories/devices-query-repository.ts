import {DeviceOutputType} from "../repositories/repositories-types/devices-types-repositories";
import {DeviceModel} from "../../domain/devices-schema-model";
import { injectable } from "inversify";
import {DeviceDBType} from "../../domain/db-types/devices-db-types";


@injectable()
export class DevicesQueryRepository {

    async getAllDevicesByUserId(userId: string): Promise<DeviceOutputType[]> {

        return DeviceModel.find({userId}, {_id: 0, userId: 0, expirationDate: 0, __v: 0, expireAt: 0} ).lean();
    }

    async getDeviceById(deviceId: string): Promise<DeviceDBType | null> {

        return DeviceModel.findOne({deviceId});
    }
}
