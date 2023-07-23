import {NextFunction,Response, Request} from "express";
import {InfoRequestType} from "../../infrastructure/repositories/repositories-types/info-request-types-repository";

export let infoRequestsArr: InfoRequestType[] = [];

export const validateInfoRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    //deleting requests with time more than 10 sec
    infoRequestsArr = infoRequestsArr.filter(e => Date.now() - e.date < 10000);

    const ip = req.socket.remoteAddress;
    const url = req.originalUrl;
    //get requests with a specific url and ip
    const countRequests = infoRequestsArr.filter(e => e.IP === ip && e.URL === url).length;

    if (countRequests > 5) {

        res.status(429).send('More than 5 attempts from one IP-address during 10 seconds');
        return;
    }
    next();
}