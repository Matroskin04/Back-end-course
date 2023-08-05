import { DeviceDocument } from './devices-db-types';

export type DeviceViewType = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

export type DeviceInstanceType = DeviceDocument;
