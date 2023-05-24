import {NextFunction,Response, Request} from "express";
import {infoRequestService} from "../../domain/info-request-service";
import {ObjectId} from "mongodb";
import {InfoRequestDBType} from "../../types/types";

export const saveInfoRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  //todo разделить на 2 middleware

    const ip = req.socket.remoteAddress;
    const infoRequest: InfoRequestDBType = {
        _id: new ObjectId,
        IP: ip!, // todo воскл знак
        URL: req.originalUrl,
        date: new Date()
    }
    await infoRequestService.saveInfoRequest(infoRequest);
    next();
}