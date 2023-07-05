import mongoose from "mongoose";
import {DeviceDBType} from "../../types/db-types";

export const DeviceSchema = new mongoose.Schema<DeviceDBType>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
    expirationDate: {type: Number, required: true},
    // expireAt: {type: Number, default: Date.now, required: true} //number or date
});
export const DeviceModel = mongoose.model<DeviceDBType>('devices', DeviceSchema);

// DeviceSchema.pre("save", async function(next) {
//
//     setTimeout(async function() {
//         const a = await DeviceModel.deleteMany({ expireAt: {$lte: Date.now()} });
//         console.log(a.deletedCount)
//     }, 10000);
//
//     next();
// })