import {Router, Response} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {usersService} from "../domain/users-service";
import {checkErrorsAuth} from "../middlewares/auth-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {jwtService} from "../domain/jwt-service";
import {tokenOutputType} from "../models/AuthModels/UriAuthModel";

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


// authRoutes.get('/me', async (req, res) => {
//
//     const
// })