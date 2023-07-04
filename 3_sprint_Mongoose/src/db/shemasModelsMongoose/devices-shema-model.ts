import mongoose from "mongoose";
import {WithId} from "mongodb";
import {DeviceType} from "../../repositories/repositories-types/devices-types-repositories";

export const DeviceSchema = new mongoose.Schema<WithId<DeviceType>>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
    expirationDate: {type: Number, required: true},
    expireAt: {type: Number, default: Date.now, required: true} //number or date
});
export const DeviceModel = mongoose.model<WithId<DeviceType>>('devices', DeviceSchema);

// DeviceSchema.pre("save", async function(next) {
//
//     setTimeout(async function() {
//         const a = await DeviceModel.deleteMany({ expireAt: {$lte: Date.now()} });
//         console.log(a.deletedCount)
//     }, 10000);
//
//     next();
// })