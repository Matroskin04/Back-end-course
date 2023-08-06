import { ObjectId } from 'mongodb';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtQueryRepository } from '../../jwt/jwt-query-repository';
import { DevicesQueryRepository } from '../infrastructure/query.repository/devices.query.repository';
import { DevicesRepository } from '../infrastructure/repository/devices.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from '../domain/devices-schema-model';
import { DeviceModelType } from '../domain/devices-db-types';
import { ResponseTypeService } from '../../../infrastructure/application/services/service-types/responses-types-service';
import { createResponseService } from '../../../infrastructure/application/services/service-utils/functions/create-response-service';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: DeviceModelType,
    protected jwtQueryRepository: JwtQueryRepository,
    protected devicesQueryRepository: DevicesQueryRepository,
    protected deviceRepository: DevicesRepository,
  ) {}

  async createNewDevice(
    ip: string,
    title: string,
    userId: ObjectId,
    refreshToken: string,
  ): Promise<void> {
    const payloadToken = this.jwtQueryRepository.getPayloadToken(refreshToken);
    if (!payloadToken) {
      throw new UnauthorizedException();
    }
    console.log(payloadToken);
    const device = await this.DeviceModel.createInstance(
      ip,
      title,
      payloadToken,
      userId,
      this.DeviceModel,
    );

    await this.deviceRepository.save(device);
    return;
  }

  async deleteDevicesExcludeCurrent(
    refreshToken: string,
  ): Promise<void | false> {
    const payloadToken = this.jwtQueryRepository.getPayloadToken(refreshToken);
    if (!payloadToken) {
      throw new Error('Refresh is invalid');
    }

    const result = await this.deviceRepository.deleteDevicesExcludeCurrent(
      payloadToken.deviceId,
    );
    if (!result) {
      throw new Error('Deletion failed');
    }

    return;
  }

  async deleteDeviceById(
    deviceId: string,
    userId: string,
  ): Promise<ResponseTypeService> {
    const device = await this.devicesQueryRepository.getDeviceById(deviceId);

    if (!device) return createResponseService(404, 'The device is not found');
    if (device.userId !== userId)
      return createResponseService(403, "You can't delete not your own device");

    const result = await this.deviceRepository.deleteDeviceById(deviceId);
    if (!result) {
      throw new Error('The device is not found');
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
}
