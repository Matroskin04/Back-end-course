import {Request, Response} from "express";
import {ViewAuthModel, ViewTokenModel} from "../models/AuthModels/ViewAuthModels";
import {authService} from "../domain/auth-service";
import {RequestWithBody} from "../types/types";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthModels";
import {devicesService} from "../domain/devices-service";
import {
    RegisterConfirmAuthModel,
    RegisterResendConfirmAuthModel,
    RegistrationAuthModel
} from "../models/AuthModels/RegistrationAuthModel";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {jwtService} from "../domain/jwt-service";

export const authController = {

    async getUserInformation(req: Request, res: Response<ViewAuthModel>) {

        const result = await authService.getUserInformation(req.userId!)
        if (result) {
            res.status(200).send(result)
        } else {
            res.sendStatus(404)
        }
    },

    async loginUser(req: RequestWithBody<LoginAuthInputModel>,
                    res: Response<ViewTokenModel>) {

        const result = await authService.loginUser(req.body.loginOrEmail, req.body.password);

        if (result) {
            await devicesService.createNewDevice(req.socket.remoteAddress || 'unknown', req.headers['user-agent'] || 'unknown', result.userId, result.refreshToken)
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,});
            res.status(200).send({accessToken: result.accessToken});

        } else {
            res.sendStatus(401);
        }
    },

    async registerUser(req: RequestWithBody<RegistrationAuthModel>,
                       res: Response<ViewAllErrorsModels | string>) {

        await authService.registerUser(req.body.email, req.body.login, req.body.password);
        res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
    },

    async confirmEmail(req: RequestWithBody<RegisterConfirmAuthModel>,
                       res: Response<ViewAllErrorsModels | string>) {

        await authService.confirmEmail(req.userId!);
        res.status(204).send('Email was verified. Account was activated')
    },

    async resendEmailConfirmation(req: RequestWithBody<RegisterResendConfirmAuthModel>,
                                  res: Response<string>) {

        await authService.resendConfirmationEmailMessage(req.userId!, req.body.email);
        res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address.')
    },

    async newRefreshToken(req: Request, res: Response<string | ViewTokenModel>) {

        const tokens = await jwtService.changeTokensByRefreshToken(req.userId!, req.refreshToken);
        if (!tokens) {
            res.status(400).send('Something was wrong');
            return;
        }

        res.cookie(`refreshToken`, tokens.refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send({accessToken: tokens.accessToken});
    },

    async logoutUser(req: Request, res: Response<void>) {

        await devicesService.deleteDeviceByRefreshToken(req.refreshToken);
        res.sendStatus(204);
    }

}