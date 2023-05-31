import mongoose from "mongoose";
import {WithId} from "mongodb";
import {InfoRequestType} from "../repositories/repositories-types/info-request-types-repository";

export const InfoRequestSchema = new mongoose.Schema<WithId<InfoRequestType>>({
    IP: String,
    URL: {type: String, required: true},
    date: {type: Date, required: true}
});
export const InfoRequestModel = mongoose.model<WithId<InfoRequestType>>('infoRequests', InfoRequestSchema);