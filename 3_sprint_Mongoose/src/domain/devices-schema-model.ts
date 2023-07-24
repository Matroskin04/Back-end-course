import mongoose from "mongoose";
import {DeviceDBType} from "./db-types/devices-db-types";

export const DeviceSchema = new mongoose.Schema<DeviceDBType>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true, expires: 60},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
    expirationDate: {type: Number, required: true},
    expireAt: {type: Date,
        default: Date.now,
        expires: '20m'}
});
export const DeviceModel = mongoose.model<DeviceDBType>('devices', DeviceSchema);
