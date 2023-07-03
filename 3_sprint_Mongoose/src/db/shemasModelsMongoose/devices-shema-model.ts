import mongoose from "mongoose";
import {WithId} from "mongodb";
import {DeviceType} from "../../repositories/repositories-types/devices-types-repositories";

export const DeviceSchema = new mongoose.Schema<WithId<DeviceType>>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true, expires: '10s'}, // todo чистка девайсов? Сделать
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
    expirationDate: {type: Number, required: true},
}, { autoIndex: false });
export const DeviceModel = mongoose.model<WithId<DeviceType>>('devices', DeviceSchema);
//indexes:
// DeviceSchema.index( { la: 1 }, { expires: '20s' } );
