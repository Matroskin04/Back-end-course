import {NextFunction, Request, Response} from "express";
import {Buffer} from "node:buffer";

export const authorization = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers['authorization'];

    if (authHeader !== undefined && authHeader ===
        `Basic ${Buffer.from(process.env.ADMIN_LOGIN_PASSWORD!).toString('base64')}`) {
        next()

    } else {
        res.sendStatus(401)
    }
}