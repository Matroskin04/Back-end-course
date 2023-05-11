import {NextFunction, Request, Response} from "express";
import {usersService} from "../../domain/users-service";
import {usersQueryRepository} from "../../queryRepository/users-query-repository";
import {authRepositories} from "../../repositories/auth-repositories";

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await usersService.getUserIdByAccessToken(token);

    if (userId) {
        req.userId = userId;
        next();
        return;
    }
    res.sendStatus(401)
}

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const cookieRefreshToken = req.cookies.cookie_name || null;
    if (!cookieRefreshToken) {
        res.status(401).send('JWT refreshToken inside cookie is missing');
        return;
    }

    const isRefreshTokenActive = await authRepositories.isRefreshTokenActive(cookieRefreshToken)
    if (!isRefreshTokenActive) {
        res.status(401).send('JWT refreshToken inside cookie is expired');
        return;
    }

    const userId = await usersService.getUserIdByRefreshToken(cookieRefreshToken);
    if (!userId) {
        res.status(401).send('JWT refreshToken inside cookie is incorrect');
        return;
    }

    const user = await usersQueryRepository.getUserByUserId(userId);
    if (!user) {
        res.status(401).send('JWT refreshToken inside cookie is incorrect');
        return;
    }
    req.body = {
        userId,
        refreshToken: cookieRefreshToken
    }; // todo используется в 1 из 2 (logout не исп.)
    next();
}


