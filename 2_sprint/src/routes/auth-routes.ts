import {Router, Response, Request} from "express";
import {RequestWithBody} from "../types/types";
import {
    RegistrationAuthModel,
    RegisterConfirmAuthModel, RegisterResendConfirmAuthModel
} from "../models/AuthModels/RegistrationAuthModel";
import {
    validateAuthConfirmationCode,
    validateLoginDataAuth,
    validateRegistrationDataAuth,
    validateAuthEmail
} from "../middlewares/validation-middlewares/auth-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {jwtService} from "../domain/jwt-service";
import {ViewAuthModel, ViewTokenModel} from "../models/AuthModels/ViewAuthModels";
import {authService} from "../domain/auth-service";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthModels";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {
    validateAccessToken,
    validateRefreshToken
} from "../middlewares/validation-middlewares/jwt-validation-middlewares";

export const authRoutes = Router();

authRoutes.get('/me', validateAccessToken, async (req: Request,
                                                  res: Response<ViewAuthModel>) => {

    const result = await authService.getUserInformation(req.userId!)
    if (result) {
        res.status(200).send(result)
    } else {
        res.sendStatus(404)
    }
})
authRoutes.post('/login', validateLoginDataAuth, getErrors, async (req: RequestWithBody<LoginAuthInputModel>,
                                                                   res: Response<ViewTokenModel>) => {

    const result = await authService.loginUser(req.body.loginOrEmail, req.body.password)
    if (result) {
        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({accessToken: result.accessToken});

    } else {
        res.sendStatus(401);
    }
})
authRoutes.post('/registration', validateRegistrationDataAuth, getErrors,
    async (req: RequestWithBody<RegistrationAuthModel>, res: Response<ViewAllErrorsModels | string>) => {

        await authService.registerUser(req.body.email, req.body.login, req.body.password);
        res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
    })
authRoutes.post('/registration-confirmation', validateAuthConfirmationCode, getErrors,
    async (req: RequestWithBody<RegisterConfirmAuthModel>, res: Response<ViewAllErrorsModels | string>) => {

        await authService.confirmEmail(req.userId!);
        res.status(204).send('Email was verified. Account was activated')
    })
authRoutes.post('/registration-email-resending', validateAuthEmail, getErrors,
    async (req: RequestWithBody<RegisterResendConfirmAuthModel>, res: Response<string>) => {

        await authService.resendConfirmationEmailMessage(req.userId!, req.body.email);
        res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address.')
    })

authRoutes.post('/refresh-token', validateRefreshToken, async (req: Request, res: Response<string | ViewTokenModel>) => { //todo типизация request - (only cookie)

    const tokens = await jwtService.changeTokensByRefreshToken(req.body.userId, req.body.refreshToken);
    res.cookie(`refreshToken`, tokens.refreshToken, {httpOnly: true, secure: true,})
    res.status(200).send({accessToken: tokens.accessToken});
})

authRoutes.post('/logout', validateRefreshToken, async (req: Request, res: Response<string | void>) => {

    await jwtService.deactivateRefreshToken(req.body.userId, req.body.refreshToken)
    res.sendStatus(204)
})