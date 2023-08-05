import { DeviceInstanceType } from './devices-types-repositories';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from './devices-schema-model';
import { DeviceModelType } from './devices-db-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: DeviceModelType,
  ) {}
  async save(device: DeviceInstanceType): Promise<void> {
    await device.save();
    return;
  }

  async getDeviceInstance(
    deviceId: ObjectId,
  ): Promise<null | DeviceInstanceType> {
    const device = await this.DeviceModel.findOne({ deviceId });

    if (!device) return null;
    return device;
  }

  async deleteDevicesExcludeCurrent(deviceId: string): Promise<boolean> {
    const result = await this.DeviceModel.deleteMany({
      deviceId: { $ne: deviceId },
    });
    return result.deletedCount > 0;
  }

  async deleteDeviceById(deviceId: string): Promise<boolean> {
    const result = await this.DeviceModel.deleteOne({ deviceId });
    return result.deletedCount === 1;
  }
}
