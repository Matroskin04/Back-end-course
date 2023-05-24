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
import {getErrors} from "../middlewares/validation-middlewares/validation-middlewares";
import {jwtService} from "../domain/jwt-service";
import {ViewAuthModel, ViewTokenModel} from "../models/AuthModels/ViewAuthModels";
import {authService} from "../domain/auth-service";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthModels";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {
    validateAccessToken,
    validateRefreshToken
} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateInfoRequest} from "../middlewares/info-request-middlewares/validate-info-request-middleware";
import {saveInfoRequest} from "../middlewares/info-request-middlewares/save-info-request-middleware";
import {devicesService} from "../domain/devices-service";

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
authRoutes.post('/login', saveInfoRequest, validateInfoRequest, validateLoginDataAuth, getErrors, async (req: RequestWithBody<LoginAuthInputModel>,
                                                                   res: Response<ViewTokenModel>) => {

    const result = await authService.loginUser(req.body.loginOrEmail, req.body.password);

    if (result) {
        await devicesService.createNewDevice(req.socket.remoteAddress || 'unknown', req.headers['user-agent'] || 'unknown', result.userId, result.refreshToken)
        res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,});
        res.status(200).send({accessToken: result.accessToken});

    } else {
        res.sendStatus(401);
    }
})
authRoutes.post('/registration', saveInfoRequest, validateInfoRequest, validateRegistrationDataAuth, getErrors,
    async (req: RequestWithBody<RegistrationAuthModel>, res: Response<ViewAllErrorsModels | string>) => {

        await authService.registerUser(req.body.email, req.body.login, req.body.password);
        res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
    })
authRoutes.post('/registration-confirmation', saveInfoRequest, validateInfoRequest, validateAuthConfirmationCode, getErrors,
    async (req: RequestWithBody<RegisterConfirmAuthModel>, res: Response<ViewAllErrorsModels | string>) => {

        await authService.confirmEmail(req.userId!);
        res.status(204).send('Email was verified. Account was activated')
    })
authRoutes.post('/registration-email-resending', saveInfoRequest, validateInfoRequest, validateAuthEmail, getErrors,
    async (req: RequestWithBody<RegisterResendConfirmAuthModel>, res: Response<string>) => {

        await authService.resendConfirmationEmailMessage(req.userId!, req.body.email);
        res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address.')
    })

authRoutes.post('/refresh-token', validateRefreshToken, async (req: Request, res: Response<string | ViewTokenModel>) => { //todo типизация request - (only cookie)

    const tokens = await jwtService.changeTokensByRefreshToken(req.userId!, req.refreshToken);
    if (!tokens) {
        res.status(400).send('Something was wrong');
        return;
    }

    res.cookie(`refreshToken`, tokens.refreshToken, {httpOnly: true, secure: true,})
    res.status(200).send({accessToken: tokens.accessToken});
})

authRoutes.post('/logout', validateRefreshToken, async (req: Request, res: Response<void>) => {

    await devicesService.deleteDeviceByRefreshToken(req.refreshToken);
    res.sendStatus(204);
})