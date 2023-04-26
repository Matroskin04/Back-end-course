import {Router, Response} from "express";
import {RequestWithBody} from "../types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";
import {usersService} from "../domain/users-service";
import {checkErrorsAuth} from "../middlewares/auth-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";

export const authRoutes = Router();

authRoutes.post('/login',  checkErrorsAuth, getErrors, async (req: RequestWithBody<LoginInputModel>, res: Response<number>) => {

    const result = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    result ? res.sendStatus(204)
        : res.sendStatus(401)
})
