import {Router, Response, Request} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {usersService} from "../domain/users-service";
import {checkErrorsAuth, checkToken} from "../middlewares/auth-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {jwtService} from "../domain/jwt-service";
import {authGetType, tokenOutputType} from "../models/AuthModels/ApiAuthModel";
import {usersQueryRepository} from "../queryRepository/users-query-repository";

export const authRoutes = Router();

authRoutes.post('/login',  checkErrorsAuth, getErrors, async (req: RequestWithBody<LoginInputModel>, res: Response<tokenOutputType>) => {

    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user) {
        const token = await jwtService.createJWT(user);
        res.status(200).send({accessToken: token});

    } else {
        res.sendStatus(401);
    }
})


authRoutes.get('/login/me', checkToken, async (req: Request, res: Response<authGetType>) => { // todo headers никак не типизируются же?

    const user = await usersQueryRepository.getUserByUserId(req.userId!);
    if (user) {
        res.status(200).send({
            email: user.email,
            login: user.login,
            userId: user._id!.toString() // todo убрать !
        })
     }
    res.sendStatus(404)
})