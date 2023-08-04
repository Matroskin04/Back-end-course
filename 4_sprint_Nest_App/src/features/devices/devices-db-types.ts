import { ObjectId } from 'mongodb';

export class DeviceDBType {
  constructor(
    public _id: ObjectId,
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public deviceId: string,
    public userId: string,
    public expirationDate: number,
    public expireAt: Date = new Date(),
  ) {}
}
