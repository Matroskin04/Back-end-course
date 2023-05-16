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

    const refreshToken = req.cookies.refreshToken || null;
    if (!refreshToken) {
        res.status(401).send('JWT refreshToken inside cookie is missing');
        return;
    }

    const isRefreshTokenActive = await authRepositories.isRefreshTokenActive(refreshToken)
    if (!isRefreshTokenActive) {
        res.status(401).send('JWT refreshToken inside cookie is invalid');
        return;
    }

    const userId = await usersService.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
        res.status(401).send('JWT refreshToken inside cookie is invalid or expired');
        return;
    }

    const user = await usersQueryRepository.getUserByUserId(userId);
    if (!user) {
        res.status(401).send('JWT refreshToken inside cookie is invalid');
        return;
    }

    req.body = {
        userId,
        refreshToken: refreshToken
    }; // todo используется в 1 из 2 (logout не исп.)
    next();
}


