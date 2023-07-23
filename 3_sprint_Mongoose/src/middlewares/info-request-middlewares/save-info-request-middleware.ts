import {NextFunction,Response, Request} from "express";
import {InfoRequestType} from "../../infrastructure/repositories/repositories-types/info-request-types-repository";
import {infoRequestsArr} from "./validate-info-request-middleware";

export const saveInfoRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const ip = req.socket.remoteAddress;
    const infoRequest: InfoRequestType = {
        IP: ip,
        URL: req.originalUrl,
        date: Date.now()
    }

    infoRequestsArr.push(infoRequest)
    next();
}