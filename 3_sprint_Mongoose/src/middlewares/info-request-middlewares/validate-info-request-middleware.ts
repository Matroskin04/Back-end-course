import {NextFunction,Response, Request} from "express";
import {infoRequestQueryRepository} from "../../queryRepository/info-request-query-repository";
import {InfoRequestFilterType} from "../../queryRepository/query-repository-types/info-request-types-query-repository";

export const validateInfoRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const ip = req.socket.remoteAddress;
    const infoRequestFilter: InfoRequestFilterType = {
        IP: ip!,
        URL: req.originalUrl,
        date10SecsAgo: new Date(Date.now() - 10000) // отнимаю 10 сек.
    }

    const documentsInfoRequests = await infoRequestQueryRepository.getInfoRequestsByFilter(infoRequestFilter);
    if ( documentsInfoRequests.length > 5 ) {

        res.status(429).send('More than 5 attempts from one IP-address during 10 seconds');
        return;
    }
    next();
}